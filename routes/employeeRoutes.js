const express = require("express");
const employeeSchema = require("../schema/employeeSchema");
const route = express.Router();
// get - post - delete
route.post("/create-employee", (req, res, next) => {
  employeeSchema.create(req.body, (err, data) => {
    if (err) {
      return next(err);
    } else {
      return res.json(data);
    }
  });
});
// Update the route for fetching all employees in your backend
route.get("/employee", async (req, res, next) => {
  try {
    const employees = await employeeSchema.find();
    const employeesWithTimespent = employees.map((employee) => {
      return {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        password: employee.password,
        timespent: employee.timespent,
      };
    });
    res.json(employeesWithTimespent);
  } catch (error) {
    next(error);
  }
});

route.get("/", (req, res, next) => {
  employeeSchema.find((err, data) => {
    if (err) {
      return next(err);
    } else {
      return res.json(data);
    }
  });
});
route.delete("/delete-employee/:id", (req, res, next) => {
  // console.log(req.params);
  employeeSchema.findByIdAndRemove(req.params.id, (err, data) => {
    if (err) {
      return next(err);
    } else {
      return res.json(data);
    }
  });
});

route.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const employee = await employeeSchema.findOne({ email: email });

    if (employee) {
      if (employee.password === password) {
        res.json({ id: employee._id, message: "Login successful" });
      } else {
        res.json({ message: "Password error" });
      }
    } else {
      res.json({ message: "No records found" });
    }
  } catch (error) {
    next(error);
  }
});

route.put("dashboard/:id/update-timespent", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { timespent } = req.body;

    // Assuming your schema has a 'timespent' field
    const updatedEmployee = await employeeSchema.findByIdAndUpdate(
      id,
      { $inc: { timespent: timespent } }, // Increment timespent by the elapsed time
      { new: true } // Get the updated document
    );

    res.json({ timespent: updatedEmployee.timespent });
  } catch (error) {
    console.error("Error updating timespent:", error);
    next(error);
  }
});

route.put("/dashboard/:id/update-intime", async (req, res, next) => {
  try {
    const employeeId = req.params.id;

    // Find the employee by ID using the employeeSchema
    const employee = await employeeSchema.findByIdAndUpdate(
      employeeId,
      { $set: { intime: new Date() } },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Intime updated successfully", intime: employee.intime });
  } catch (error) {
    next(error);
  }
});

route.put("/dashboard/:id/update-timespent", async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const { elapsedSeconds } = req.body;

    // Find the employee by ID using the employeeSchema
    const employee = await employeeSchema.findByIdAndUpdate(
      employeeId,
      { $inc: { timespent: elapsedSeconds } },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Timespent updated successfully", timespent: employee.timespent });
  } catch (error) {
    next(error);
  }
});

route.put("/update-outtime/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { outtime, timespent } = req.body; // Receive timespent directly from the frontend

    // Fetch the user by ID
    const user = await employeeSchema.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the outtime and timespent
    user.outtime = outtime;
    user.timespent = timespent;

    // Save the updated user data
    const updatedUser = await user.save();

    return res.json({ timespent: updatedUser.timespent });
  } catch (error) {
    console.error("Error updating outtime and timespent:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

route
  .route("/update-employee/:id")
  .get((req, res, next) => {
    employeeSchema.findById(req.params.id, (err, data) => {
      if (err) {
        return next(err);
      } else {
        return res.json(data);
      }
    });
  })
  .put((req, res, next) => {
    employeeSchema.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      (err, data) => {
        if (err) {
          return next(err);
        } else {
          return res.json(data);
        }
      }
    );
  });

  route.put("/update-intime/:id", (req, res, next) => {
    const { intime } = req.body;
    employeeSchema.findByIdAndUpdate(
      req.params.id,
      { $set: { intime: new Date(intime) } },
      { new: true },
      (err, data) => {
        if (err) {
          return next(err);
        } else {
          return res.json(data);
        }
      }
    );
  });

  route.put("/dashboard/:id", async (req, res, next) => {
    try {
      const employeeId = req.params.id;
  
      // Find the employee by ID using the employeeSchema
      const employee = await employeeSchema.findByIdAndUpdate(
        employeeId,
        { $set: { intime: new Date() } },
        { new: true }
      );
  
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
  
      res.json({ message: "Intime updated successfully", intime: employee.intime });
    } catch (error) {
      next(error);
    }
  });
  route.post("/admin/login", async (req, res, next) => {
    try {
      // Perform admin login verification here
      // Check admin credentials and return appropriate response
      // Example:
      const { email, password } = req.body;
      if (email === "admin@example.com" && password === "adminpassword") {
        res.json({ message: "Admin login successful" });
      } else {
        res.json({ message: "Admin login failed" });
      }
    } catch (error) {
      next(error);
    }
  });

  // route.get("/dashboard/:id", async (req, res, next) => {
  //   try {
  //     const employeeId = req.params.id;
  
  //     // Find the employee by ID using the employeeSchema
  //     const employee = await employeeSchema.findById(employeeId);
  
  //     if (!employee) {
  //       return res.status(404).json({ error: "Employee not found" });
  //     }
  
  //     // Check if intime is available
  //     if (!employee.intime) {
  //       return res.json({ timespent: null });
  //     }
  
  //     // Calculate timespent if intime is available
  //     const currentTime = new Date();
  //     const timeDifference = currentTime - employee.intime;
  //     const timespentInHours = timeDifference / (1000 * 3600); // Convert milliseconds to hours
  
  //     res.json({ timespent: timespentInHours });
  //   } catch (error) {
  //     next(error);
  //   }
  // });

  // route.get("/dashboard/:id", async (req, res, next) => {
  //   try {
  //     const employeeId = req.params.id;
  
  //     // Find the employee by ID
  //     const employee = await employeeSchema.findById(employeeId);
  
  //     if (!employee) {
  //       return res.status(404).json({ error: "Employee not found" });
  //     }
  
  //     // Check if intime is available
  //     if (!employee.intime) {
  //       return res.json({ timespent: null });
  //     }
  
  //     // Calculate timespent if intime is available
  //     const currentTime = new Date();
  //     const timeDifference = currentTime - employee.intime;
  //     const timespentInHours = timeDifference / (1000); // Convert milliseconds to hours
  
  //     res.json({ timespent: timespentInHours });
  //   } catch (error) {
  //     next(error);
  //   }
  // });
  

  route.put("/update-timespent/:id", async (req, res, next) => {
    try {
      const userId = req.params.id;
      const { elapsedSeconds } = req.body; // Receive elapsedSeconds directly from the frontend
  
      // Fetch the user by ID
      const user = await employeeSchema.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Update the timespent with the elapsed time
      user.timespent += elapsedSeconds;
  
      // Save the updated user data
      const updatedUser = await user.save();
  
      return res.json({ timespent: updatedUser.timespent });
    } catch (error) {
      console.error("Error updating timespent:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Update outtime for a specific employee
  route.put("/update-outtime/:id", async (req, res, next) => {
    try {
      const userId = req.params.id;
      const { outtime, timespent } = req.body; // Receive timespent directly from the frontend
  
      // Fetch the user by ID
      const user = await employeeSchema.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Update the outtime and timespent
      user.outtime = outtime;
      user.timespent = timespent; // Assuming timespent is already in seconds
  
      // Save the updated user data
      const updatedUser = await user.save();
  
      return res.json({ timespent: updatedUser.timespent });
    } catch (error) {
      console.error("Error updating outtime and timespent:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });


module.exports = route;
