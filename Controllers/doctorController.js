import Booking from "../models/BookingSchema.js"
import Doctor from "../models/DoctorSchema.js"

export const updateDoctor = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        if (!updatedDoctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.status(200).json({ success: true, message: 'Doctor updated successfully', data: updatedDoctor });
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({ success: false, message: 'Failed to update doctor' });
    }
};
export const deleteDoctor = async (req, res) => {
    const id = req.params.id;
    try {
        await Doctor.findByIdAndDelete(id)
        res.status(200).json({ success: true, message: "Xoá thành công" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Xoá thất bại" })
    }
}
export const getSingleDoctor = async (req, res) => {
    const id = req.params.id
    try {
        const doctor = await Doctor.findById(id).populate("reviews").select("-password")
        res.status(200).json({ success: true, message: "Đã tìm thấy bác sĩ", data: doctor })
    } catch (error) {
        res.status(500).json({ success: false, message: "Không tìm thấy" })
    }
}
export const getAllDoctor = async (req, res) => {
    try {
        const { query } = req.query;
        let filter = { isApproved: "approved" };
        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { specialization: { $regex: query, $options: 'i' } }
            ];
        }
        const doctors = await Doctor.find(filter).select("-password");

        res.status(200).json({ success: true, message: "Đã tìm thấy tài khoản", data: doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: "Không tìm thấy tài khoản" })
    }
}

export const getDoctorProfile = async (req, res) => {
    const doctorId = req.userId;
    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Bác sĩ này không tồn tại" });
        }
        const { password, ...rest } = doctor._doc;
        const appointments = await Booking.find({ doctor: doctorId });
        res.status(200).json({ success: true, message: "Thông tin hồ sơ đang được tải", data: { ...rest, appointments } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Đã có lỗi xảy ra, không thể lấy thông tin" });
    }
};
