package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

type Athlete struct {
	ID             int    `json:"id"`
	Name           string `json:"name"`
	Grade          string `json:"grade"`
	SchoolLevel    string `json:"school_level"`
	PersonalRecord string `json:"personal_record"`
}

type Meet struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Date     string `json:"date"`
	Location string `json:"location"`
}

type Result struct {
	ID          int    `json:"id"`
	AthleteID   int    `json:"athlete_id"`
	AthleteName string `json:"athlete_name,omitempty"`
	MeetID      int    `json:"meet_id"`
	MeetName    string `json:"meet_name,omitempty"`
	Time        string `json:"time"`
	Place       int    `json:"place"`
}

func main() {
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbName := os.Getenv("DB_NAME")

	if dbUser == "" {
		dbUser = "ccuser"
	}
	if dbPass == "" {
		dbPass = "CCpassword123!"
	}
	if dbName == "" {
		dbName = "crosscountry"
	}

	dsn := dbUser + ":" + dbPass + "@tcp(localhost:3306)/" + dbName
	var err error
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	if err = db.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}
	log.Println("Connected to MySQL database")

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "healthy",
			"message": "Hello from Go backend!",
		})
	})

	r.GET("/api/athletes", getAthletes)
	r.GET("/api/athletes/:id", getAthlete)
	r.POST("/api/athletes", createAthlete)
	r.PUT("/api/athletes/:id", updateAthlete)
	r.DELETE("/api/athletes/:id", deleteAthlete)

	r.GET("/api/meets", getMeets)
	r.GET("/api/meets/:id", getMeet)
	r.POST("/api/meets", createMeet)
	r.PUT("/api/meets/:id", updateMeet)
	r.DELETE("/api/meets/:id", deleteMeet)

	r.GET("/api/results", getResults)
	r.POST("/api/results", createResult)
	r.DELETE("/api/results/:id", deleteResult)

	log.Println("Backend server starting on :8080")
	r.Run(":8080")
}

func getAthletes(c *gin.Context) {
	rows, err := db.Query("SELECT id, name, grade, school_level, COALESCE(personal_record, '') FROM athletes")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var athletes []Athlete
	for rows.Next() {
		var a Athlete
		if err := rows.Scan(&a.ID, &a.Name, &a.Grade, &a.SchoolLevel, &a.PersonalRecord); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		athletes = append(athletes, a)
	}
	c.JSON(http.StatusOK, athletes)
}

func getAthlete(c *gin.Context) {
	id := c.Param("id")
	var a Athlete
	err := db.QueryRow("SELECT id, name, grade, school_level, COALESCE(personal_record, '') FROM athletes WHERE id = ?", id).Scan(&a.ID, &a.Name, &a.Grade, &a.SchoolLevel, &a.PersonalRecord)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Athlete not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, a)
}

func createAthlete(c *gin.Context) {
	var a Athlete
	if err := c.ShouldBindJSON(&a); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result, err := db.Exec("INSERT INTO athletes (name, grade, school_level, personal_record) VALUES (?, ?, ?, ?)", a.Name, a.Grade, a.SchoolLevel, a.PersonalRecord)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	id, _ := result.LastInsertId()
	a.ID = int(id)
	c.JSON(http.StatusCreated, a)
}

func updateAthlete(c *gin.Context) {
	id := c.Param("id")
	var a Athlete
	if err := c.ShouldBindJSON(&a); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	_, err := db.Exec("UPDATE athletes SET name=?, grade=?, school_level=?, personal_record=? WHERE id=?", a.Name, a.Grade, a.SchoolLevel, a.PersonalRecord, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Athlete updated"})
}

func deleteAthlete(c *gin.Context) {
	id := c.Param("id")
	_, err := db.Exec("DELETE FROM athletes WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Athlete deleted"})
}

func getMeets(c *gin.Context) {
	rows, err := db.Query("SELECT id, name, date, location FROM meets")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var meets []Meet
	for rows.Next() {
		var m Meet
		if err := rows.Scan(&m.ID, &m.Name, &m.Date, &m.Location); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		meets = append(meets, m)
	}
	c.JSON(http.StatusOK, meets)
}

func getMeet(c *gin.Context) {
	id := c.Param("id")
	var m Meet
	err := db.QueryRow("SELECT id, name, date, location FROM meets WHERE id = ?", id).Scan(&m.ID, &m.Name, &m.Date, &m.Location)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Meet not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, m)
}

func createMeet(c *gin.Context) {
	var m Meet
	if err := c.ShouldBindJSON(&m); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result, err := db.Exec("INSERT INTO meets (name, date, location) VALUES (?, ?, ?)", m.Name, m.Date, m.Location)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	id, _ := result.LastInsertId()
	m.ID = int(id)
	c.JSON(http.StatusCreated, m)
}

func updateMeet(c *gin.Context) {
	id := c.Param("id")
	var m Meet
	if err := c.ShouldBindJSON(&m); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	_, err := db.Exec("UPDATE meets SET name=?, date=?, location=? WHERE id=?", m.Name, m.Date, m.Location, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Meet updated"})
}

func deleteMeet(c *gin.Context) {
	id := c.Param("id")
	_, err := db.Exec("DELETE FROM meets WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Meet deleted"})
}

func getResults(c *gin.Context) {
	rows, err := db.Query("SELECT r.id, r.athlete_id, a.name, r.meet_id, m.name, r.time, r.place FROM results r JOIN athletes a ON r.athlete_id = a.id JOIN meets m ON r.meet_id = m.id")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var results []Result
	for rows.Next() {
		var r Result
		if err := rows.Scan(&r.ID, &r.AthleteID, &r.AthleteName, &r.MeetID, &r.MeetName, &r.Time, &r.Place); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		results = append(results, r)
	}
	c.JSON(http.StatusOK, results)
}

func createResult(c *gin.Context) {
	var r Result
	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result, err := db.Exec("INSERT INTO results (athlete_id, meet_id, time, place) VALUES (?, ?, ?, ?)", r.AthleteID, r.MeetID, r.Time, r.Place)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	id, _ := result.LastInsertId()
	r.ID = int(id)
	c.JSON(http.StatusCreated, r)
}

func deleteResult(c *gin.Context) {
	id := c.Param("id")
	_, err := db.Exec("DELETE FROM results WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Result deleted"})
}
