import { FaBars} from 'react-icons/fa';
import { Button } from '../ui/button';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  title: string;
}
const Navbar = ({ sidebarOpen, setSidebarOpen, title }: NavbarProps) => {
  
  return (
    <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
      <div className="flex items-center justify-center gap-4">
        <div>
          <h1 className='text-3xl font-bold'>{title}</h1>
        </div>
      </div>
      <Button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-200 focus:outline-none md:hidden">
        <FaBars className="text-2xl" />
      </Button>
    </div>
  );
};

export default Navbar;