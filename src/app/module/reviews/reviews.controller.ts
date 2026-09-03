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

export const reviewController={
    giveReviews
}
