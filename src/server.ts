
import app from "./app";
import "dotenv/config"
import { envVars } from "./app/config/env";
import { seedsuperAdmin } from "./app/utlis/seed";


const port=envVars.PORT

const bootcamp=async()=>{
  try {
    await seedsuperAdmin()
    app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
    
  } catch (error) {
    console.error("failed to run", error)
    
  }
}

bootcamp();