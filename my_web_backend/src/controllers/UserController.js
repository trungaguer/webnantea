const userService = require("../services/UserService");
const JwtService = require("../services/JwtService");

const createUser = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);

    if (!email || !password || !confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is email",
      });
    }

    if (password !== confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The password is not equal confirmPassword",
      });
    }

    const response = await userService.createUser(req.body);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);

    if (!email || !password) {
      return res.status(400).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    if (!isCheckEmail) {
      return res.status(400).json({
        status: "ERR",
        message: "The input is email",
      });
    }

    const response = await userService.loginUser(req.body);

    if (response.status === "ERR") {
      return res.status(400).json(response);
    }

    const { refresh_token, access_token, ...newResponse } = response;

    // ✅ Lưu refresh_token vào cookie
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });

    // ✅ (NEW) lưu luôn access_token vào cookie (optional nhưng nên có)
    if (access_token) {
      res.cookie("access_token", access_token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
      });
    }

    return res.status(200).json({
      ...newResponse,
      access_token,
      refresh_token,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    const response = await userService.updateUser(userId, data);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    const response = await userService.deleteUser(userId);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await userService.getAllUser();

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    const response = await userService.getDetailsUser(userId);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    // ✅ Ưu tiên lấy từ cookie (đã dùng cookie-parser)
    let token = req.cookies?.refresh_token;

    // fallback sang header nếu cần
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        status: "ERR",
        message: "The token is required",
      });
    }

    const response = await JwtService.refreshTokenJwtService(token);

    // ✅ nếu có access_token mới thì set lại cookie
    if (response?.access_token) {
      res.cookie("access_token", response.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
      });
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({
      status: "OK",
      message: "Logout successfully",
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  refreshToken,
  logoutUser,
};
