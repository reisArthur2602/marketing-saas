import { redirect } from "next/navigation";

const Home = () => {
  return redirect("/auth");
};

export default Home;
