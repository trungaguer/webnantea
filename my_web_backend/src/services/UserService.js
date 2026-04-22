const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone } = newUser;
    try {
      const checkUser = await User.findOne({ email });

      if (checkUser !== null) {
        return resolve({
          status: "ERR",
          message: "The email is already in use",
        });
      }

      if (password !== confirmPassword) {
        return resolve({
          status: "ERR",
          message: "Password not match",
        });
      }

      // ✅ hash async (tốt hơn sync)
      const hash = await bcrypt.hash(password, 10);

      const createdUser = await User.create({
        name,
        email,
        password: hash,
        phone,
      });

      // ❌ không trả password ra ngoài
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

const {
  genneralAccessToken,
  genneralRefreshToken,
} = require("../services/JwtService");

const loginUser = async (userLogin) => {
  const { email, password } = userLogin;

  try {
    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return {
        status: "ERR",
        message: "The user is not defined",
      };
    }

    // ✅ dùng async
    const comparePassword = await bcrypt.compare(password, checkUser.password);

    if (!comparePassword) {
      return {
        status: "ERR",
        message: "The password or user is incorrect",
      };
    }

    const access_token = await genneralAccessToken({
      id: checkUser.id,
      isAdmin: checkUser.isAdmin,
    });

    const refresh_token = await genneralRefreshToken({
      id: checkUser.id,
      isAdmin: checkUser.isAdmin,
    });

    return {
      status: "OK",
      message: "SUCCESS",
      access_token,
      refresh_token,
    };
  } catch (e) {
    throw e;
  }
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      if (checkUser === null) {
        return resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }

      // ✅ nếu update password → hash lại
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

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      if (checkUser === null) {
        return resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }

      await User.findByIdAndDelete(id);

      return resolve({
        status: "OK",
        message: "Delete user success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // ❌ không trả password
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

const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(id).select("-password");

      if (!user) {
        return resolve({
          status: "ERR",
          message: "The user is not defined",
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
