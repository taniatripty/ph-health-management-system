
import app from "./app";
import "dotenv/config"
import { envVars } from "./app/config/env";


const port=envVars.PORT

const bootcamp=()=>{
  try {
    app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
    
  } catch (error) {
    console.error("failed to run", error)
    
  }
}

bootcamp();