import Header from '../../components/user/Header'
import Banner from '../../components/user/Banner'
import Features from '../../components/user/Features'
import WorkFlow from '../../components/user/WorkFlow'
import Footer from '../../components/user/Footer'

function HomePage() {
  return (
    <div className="pt-16">
        <Header />
        <Banner />
        <Features />
        <WorkFlow />
        <Footer />
    </div>
  )
}

export default HomePage