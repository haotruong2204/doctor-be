import User from "../models/UserSchema.js"
import Booking from "../models/BookingSchema.js"
import Doctor from "../models/DoctorSchema.js"
export const updateUser = async (req, res)=>{
    const id = req.params.id
    console.log(id)
    try {
        const updateUser= await User.findByIdAndUpdate(id, {$set:req.body}, {new:true} )
        res.status(200).json({success:true, message:"Cập nhật thành công", data:updateUser})
    } catch (error) {
        res.status(500).json({success:false , message:"Cập nhật thất bại"})
    }
}
export const deleteUser = async (req, res)=>{
    const id = req.params.id;
    try {
        await User.findByIdAndDelete(id)
        res.status(200).json({success:true, message:"Xoá thành công"})
    } catch (error) {
        res.status(500).json({success:false , message:"Xoá thất bại"})
    }
}
export const getSingleUser = async (req, res)=>{
    const id = req.params.id
    try {
        const user= await User.findById(id).select("-password")
        res.status(200).json({success:true, message:"Đã tìm thấy tài khoản", data:user})
    } catch (error) {
        res.status(500).json({success:false , message:"Không tìm thấy"})
    }
}
export const getAllUser = async (req, res)=>{
    try {
        const user= await User.find({}).select("-password")
        res.status(200).json({success:true, message:"Đã tìm thấy tài khoản", data:user})
    } catch (error) {
        res.status(500).json({success:false , message:"Không tìm thấy tài khoản"})
    }
}

export const getUserProfile = async (req, res ) =>{
    const userId = req.userId
    try {
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({success:false , message:"Người dùng không tồn tại"})
        }
        const {password, ...rest} = user._doc
        res.status(200).json({success:true, message:"Thông tin hồ sơ đang được tải", data:{...rest}})
    } catch (error) {
        res.status(500).json({success:false , message:"Có sự cố xảy ra, không thể truy cập được thông tin"})        
    }
}

export const getMyAppointment = async (req, res) =>{
    try {
        // lấy data cuộc hện từ user
        const bookings = await Booking.find({user:req.userId})
        // lays thông tin bác sĩ từ cuộc hẹn
        const doctorIds = bookings.map(el=>el.doctor.id)
        // lấy data bác sĩ từ id
        const doctors = await Doctor.find({_id:{$in:doctorIds}}).select('-password')
        res.status(200).json({success:true, message:"Đang lấy thông tin cuộc hẹn", data:doctors})
    } catch (error) {
        res.status(500).json({success:false , message:"Có sự cố xảy ra, không thể truy cập được thông tin"})               
    }
}