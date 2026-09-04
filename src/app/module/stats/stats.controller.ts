import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { StatsService } from "./stats.services";


const getDashboardStatsData = catchAsync(async (req , res) => {
  
 const user=req.user

  
  const result = await StatsService.getDashboardStatsData(user);

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Get statisticsData successfully",
    data: result,
  });
});

export const statsController={
    getDashboardStatsData
}