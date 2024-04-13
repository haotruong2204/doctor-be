import Review from "../models/ReviewSchema.js"
import Doctor from "../models/DoctorSchema.js"

export const getAllReviews = async (req, res) =>{
    try {
        const reviews = await Review.find({})
        res.status(200).json({success:true, message:"Thành công", data:reviews})
    } catch (error) {
        res.status(404).json({success:false, message:"Không tìm thấy"})

    }
}

export const createReview = async(req, res)=>{
    if(!req.body.doctor) req.body.doctor = req.params.doctorId
    if(!req.body.user) req.body.user = req.params.userId
    const newReview = new Review(req.body)
    try{
        const savedReview = await newReview.save()
        await Doctor.findByIdAndUpdate(req.body.doctor,{
            $push:{reviews: savedReview._id}
        })
        res.status(200).json({success:true, message:"Đánh giá đã được ghi nhận", data:savedReview})
    }catch{
        res.status(500).json({success:false, message:"Không ghi nhận được đánh giá"})
    }
}