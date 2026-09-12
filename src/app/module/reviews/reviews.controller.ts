import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { reviewServices } from "./reviews.services";


const giveReviews = catchAsync(async (req , res) => {
  const payload=req.body
 const user=req.user

  console.log("paylod :",payload)
  const result = await reviewServices.giveReview(user,payload);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "give review successfully",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req , res) => {
  

  
  const result = await reviewServices.getAllReviews();

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Get all review successfully",
    data: result,
  });
});

const getMyReviews = catchAsync(async (req , res) => {
  

  const user=req.user
  const result = await reviewServices.myReviews(user);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Get my  all review successfully",
    data: result,
  });
});

const deleteReviews = catchAsync(async (req , res) => {
  

  const user=req.user
   const reviewId = req.params.id;
  const result = await reviewServices.deleteReview(user,reviewId as string);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Get my  all review successfully",
    data: result,
  });
});

export const reviewController={
    giveReviews,
    getAllReviews,
    getMyReviews,
    deleteReviews
}
