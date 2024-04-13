import User from "../models/UserSchema.js"
import Doctor from "../models/DoctorSchema.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const generateToken = user =>{
    return jwt.sign(
        {id:user._id, role:user.role}, 
        process.env.JWT_SECRET_KEY,{
        expiresIn:"356d",
    })
}
export const register = async (req, res) => {
    const { email, password, name, role, photo, gender } = req.body;
    try {
        let user = null
        if (role === 'patient') {
            user = await User.findOne({ email })
        } else if (role === 'doctor') {
            user = await Doctor.findOne({ email })
        }
        if (user) {
            return res.status(400).json({ message: "Người dùng này đã tồn tại" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        if (role === 'patient') {
            user = new User({
                name,
                email,
                password: hashPassword,
                photo,
                gender,
                role
            })
        }
        if (role === 'doctor') {
            user = new Doctor({
                name,
                email,
                password: hashPassword,
                photo,
                gender,
                role
            })
        }
        await user.save()
        res.status(200).json({ success: true, message: "Tài khoản đã được tạo thành công" })

    } catch (error) {
        res.status(500).json({ success: true, message: "Internet sever fail! Try again!" })
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      let user = null;
      const patient = await User.findOne({ email });
      const doctor = await Doctor.findOne({ email });
  
      if (patient) {
        user = patient;
      } else if (doctor) {
        user = doctor;
      }
  
      if (!user) {
        return res.status(404).json({ message: "Tài khoản không tồn tại" });
      }
  
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ status: false, message: "Sai mật khẩu!" });
      }
  
      const token = generateToken(user);
      const { password: userPassword, role, appointments, ...rest } = user._doc;
      res.status(200).json({
        status: true,
        message: "Đăng nhập thành công 🎉🎉🎉",
        token,
        data: { ...rest },
        role,
      });
    } catch (error) {
      console.error("Error during login:", error); // Log lỗi để theo dõi
      res.status(500).json({ status: false, message: "Lỗi đăng nhập" });
    }
  };
  