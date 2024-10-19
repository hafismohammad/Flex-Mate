import TrainersList from "../../components/user/TrainersList"
import Header from "../../components/user/Header"
import Footer from "../../components/user/Footer"
import Sidebar from "../../components/user/TrainersSidebar"
import TrainersListBanner from "../../components/user/TrainersListBanner"

function TrainersPage() {
  return (
    <div className="min-h-screen flex flex-col">
    <Header />
    <TrainersListBanner />
    <div className="flex flex-1 bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6">
        <TrainersList />
      </div>
    </div>

    <Footer />
  </div>
  )
}

export default TrainersPage