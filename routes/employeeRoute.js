const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  getById,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");
const Employee = require("../models/Employee");

//get post put delete

router.post("/add-emp", createEmployee);
router.get("/", getEmployees);
router.get("/getByID/:id", getById);
router.put("/update/:id", updateEmployee);
router.delete("/delete/:id", deleteEmployee);

module.exports = router;
