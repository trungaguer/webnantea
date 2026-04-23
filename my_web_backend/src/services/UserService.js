const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

const {
  genneralAccessToken,
  genneralRefreshToken,
} = require("../services/JwtService");

// ================= CREATE USER =================
const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, email, password, confirmPassword, phone } = newUser;

      const checkUser = await User.findOne({ email });

      if (checkUser) {
        return resolve({
          status: "ERR",
          message: "Email already exists",
        });
      }

      if (password !== confirmPassword) {
        return resolve({
          status: "ERR",
          message: "Password not match",
        });
      }

      const hash = await bcrypt.hash(password, 10);

      const createdUser = await User.create({
        name,
        email,
        password: hash,
        phone,
      });

      const { password: _, ...userWithoutPassword } = createdUser._doc;

      return resolve({
        status: "OK",
        message: "SUCCESS",
        data: userWithoutPassword,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// ================= LOGIN USER =================
const loginUser = async (userLogin) => {
  const { email, password } = userLogin;

  try {
    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return {
        status: "ERR",
        message: "User not found",
      };
    }

    const isMatch = await bcrypt.compare(password, checkUser.password);

    if (!isMatch) {
      return {
        status: "ERR",
        message: "Wrong password",
      };
    }

    // ================= FIX CHÍNH =================
    const payload = {
      id: checkUser._id, // ✔ QUAN TRỌNG NHẤT
      isAdmin: checkUser.isAdmin,
    };

    const access_token = await genneralAccessToken(payload);

    const refresh_token = await genneralRefreshToken(payload);

    return {
      status: "OK",
      message: "SUCCESS",
      access_token,
      refresh_token,
      user: {
        id: checkUser._id,
        name: checkUser.name,
        email: checkUser.email,
        isAdmin: checkUser.isAdmin,
      }, // ✔ thêm user để FE khỏi bị "không có dữ liệu"
    };
  } catch (e) {
    throw e;
  }
};

// ================= UPDATE USER =================
const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(id);

      if (!user) {
        return resolve({
          status: "ERR",
          message: "User not found",
        });
      }

      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(id, data, {
        new: true,
      });

      const { password, ...userWithoutPassword } = updatedUser._doc;

      return resolve({
        status: "OK",
        message: "SUCCESS",
        data: userWithoutPassword,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// ================= DELETE USER =================
const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(id);

      if (!user) {
        return resolve({
          status: "ERR",
          message: "User not found",
        });
      }

      await User.findByIdAndDelete(id);

      return resolve({
        status: "OK",
        message: "Delete success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// ================= GET ALL =================
const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await User.find().select("-password");

      return resolve({
        status: "OK",
        message: "SUCCESS",
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// ================= GET DETAILS =================
const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        return resolve({
          status: "ERR",
          message: "Missing user id",
        });
      }

      const user = await User.findById(id).select("-password");

      if (!user) {
        return resolve({
          status: "ERR",
          message: "User not found",
        });
      }

      return resolve({
        status: "OK",
        message: "SUCCESS",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
};
