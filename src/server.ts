
import app from "./app";
import "dotenv/config"

const port=process.env.PORT


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