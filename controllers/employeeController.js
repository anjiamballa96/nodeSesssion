const Employee = require("../models/Employee");

// model schema
// const tourSchema = new mongoose.Schema({
//   name: {type: String,required: [true, "A tour must have a name"],unique: true,},
//   rating: {type: Number,default: 3.0,},
//   price: {type: Number,required: [true, "A tour must have a price"],},
// });
// module.exports  = mongoose.model("Tour", tourSchema);

//  save() can be used on a new document of the model while
//create() can be used on the model. Below, I have given a simple example.

// exports.createTour = async (req, res) => {
//   // method 1
//   const newTour = await Tour.create(req.body);
//   // method 2
//   const newTour = new Tour(req.body);
//   await newTour.save();
// }

const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, city } = req.body;
    //method 1
    // await Employee.create({ name : name, email, phone, city });
    //method 2
    const newEmployee = new Employee({ name, email, phone, city });
    await newEmployee.save();
    res.status(201).json({ message: "Created Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error in creation", Error: err });
  }
};

const getEmployees = async (req, res) => {
  try {
    const data = await Employee.find();
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: "Error", Error: err });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const empDetails = await Employee.findById(id);
    if (!empDetails) {
      return res.status(404).json({ message: "Employee not found" });
    } else {
      res.status(200).json({ empDetails });
    }
  } catch (err) {
    res.status(500).json({ message: "Error", Error: err });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { name, email, phone, city } = req.body;
    const { id } = req.params;
    const employeeUpdate = await Employee.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      city,
    });
    if (!employeeUpdate) {
      return res.status(404).json({ message: "Employee not found" });
    } else {
      res.status(200).json({ message: "Employee updated successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error", Error: err });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params)
    const deleteEmployee = await Employee.findByIdAndDelete(id);
    if (!deleteEmployee) {
      return res.status(404).json({ message: "Some error occured" });
    } else {
      res.status(200).json({ message: "Successfully employee deleted" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error", Error: err });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getById,
  updateEmployee,
  deleteEmployee,
};
