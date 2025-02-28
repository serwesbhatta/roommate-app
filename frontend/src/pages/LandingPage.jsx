
import { Navbar } from '../components/layouts';


const LandingPage = () => {

  const menuItems = [
    { label: 'Home', link: '/' },
    { label: 'About', link: '/about' },
    { label: 'Contact', link: '/contact' },
  ];

  return (
    <div>
      <Navbar title="My App" menuItems={menuItems} />
    </div>
  )
}

export default LandingPage