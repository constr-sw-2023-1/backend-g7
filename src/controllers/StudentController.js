const StudentModel = require('../models/StudentModel');
const ApiError = require('../errors/ApiError');

async function createStudent(req, res, next) {
  try {
    const student = await StudentModel.createStudent(req.body);
    res.status(201).send({
      message: "Student Created Successfully",
      data: student
    });
  } catch (error) {
    console.error(error.stack);

    if (res.status(400)) {
      next(ApiError.badRequest('Invalid input. Check your URL'));
      return;
    } else if (res.status(500)) {
      next(ApiError.internalError('Internal Server Error'));
      return;
    }
  }
}

async function deleteStudent(req, res, next) {
  try {
    const deleted = await StudentModel.deleteStudent(req.params.id);

    return res.status(200).send({
      message: 'Student Deleted Successfully',
    });
  } catch (error) {
    console.error(error.stack);

    if (res.status(400)) {
      next(ApiError.badRequest('Invalid search. Check your URL'));
      return;
    } else if (res.status(404)) {
      next(ApiError.notFound('Student not found'));
      return;
    } else if (res.status(500)) {
      next(ApiError.internalError('Internal Server Error'));
      return;
    }
  }
}

async function updateStudent(req, res, next) {
  const { id } = req.params;
  const newData = req.body;

  try {
    const updatedStudent = await StudentModel.updateStudent(id, newData);

    return res.status(200).send({
      message: 'Student Updated Successfully',
      result: updatedStudent,
    });

  } catch (error) {
    console.error(error.stack);

    if (res.status(400)) {
      next(ApiError.badRequest('Invalid search. Check your URL'));
      return;
    } else if (res.status(404)) {
      next(ApiError.notFound('Student not found'));
      return;
    } else if (res.status(500)) {
      next(ApiError.internalError('Internal Server Error'));
      return;
    }
  }
}

async function listStudents(req, res, next) {
  try {
    const filters = req.query;
    let students;

    if (Object.keys(filters).length > 0) {
      const paramsWithOperators = Object.entries(filters).filter(([key, value]) => value.includes('{') && value.includes('}'));

      if (paramsWithOperators.length > 0) {
        students = await StudentModel.listStudentsWithOperators(paramsWithOperators);
      } else {
        students = await StudentModel.listStudentByQueryString(filters);
      }

      if (!students || students.length === 0) {
        throw ApiError.notFound('No Students Found With The Specified Filters');
      }
    } else {
      students = await StudentModel.listStudents();
    }

    res.status(200).send({
      message: 'Students Listed Successfully',
      students: students,
    });
  } catch (error) {
    console.error(error.stack);

    if (error instanceof ApiError) {
      next(error);
    } else {
      next(ApiError.internalError('Internal Server Error'));
    }
  }
}

async function listStudentById(req, res, next) {
  try {
    const student = await StudentModel.listStudentById(req.params.id);

    if (Object.keys(student).length === 0) {
        throw ApiError.notFound('Student not found');
    }

    return res.status(200).send({
      message: 'Student Listed Successfully',
      student: student,
    });
  } catch (error) {
    console.error(error.stack);

    if (res.status(400)) {
      next(ApiError.badRequest('Invalid search. Check your URL'));
      return;
    } else if (res.status(404)) {
        next(ApiError.notFound('Student not found'));
        return;
    } else if (res.status(500)) {
      next(ApiError.internalError('Internal Server Error'));
      return;
    }
  }
}

module.exports = { createStudent, deleteStudent, updateStudent, listStudents, listStudentById };