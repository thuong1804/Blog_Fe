import { FaBlogger } from "react-icons/fa";
import Button from "@/components/Button/Button";
import SearchBar from "@/components/SearchBar/SearchBar";
import Categories from "@/components/Categories/Categories";

const HeaderLayout = () => {
  const categoriesData = [
    {
      name: 'Programming',
      id: 1,
      description: 'All things about programming languages and concepts.',
      children: [
        { name: 'JavaScript', description: 'Scripting language for the web.' },
        { name: 'TypeScript', description: 'Typed superset of JavaScript.' },
        { name: 'Python', description: 'High-level language for automation and data.' },
      ],
    },
    {
      name: 'Emerging Tech',
      description: 'New and disruptive technologies.',
      children: [
        { name: 'Artificial Intelligence', description: 'The simulation of human intelligence by machines.' },
        { name: 'Virtual Reality', description: 'Immersive digital environments.' },
        { name: 'Blockchain', description: 'Decentralized digital ledger technology.' },
      ],
    },
    {
      name: 'Infrastructure',
      description: 'Everything about dev infrastructure and deployment.',
      children: [
        { name: 'Cloud', description: 'Modern cloud computing solutions.' },
        { name: 'DevOps', description: 'Continuous delivery & collaboration practices.' },
        { name: 'Kubernetes', description: 'Container orchestration system.' },
      ],
    },
    {
      name: 'AI & Data',
      description: 'Topics covering artificial intelligence and data processing.',
      children: [
        { name: 'Machine Learning', description: 'Algorithms that learn from data.' },
        { name: 'Deep Learning', description: 'Neural networks and advanced models.' },
        { name: 'Data Science', description: 'Extracting insights from data.' },
      ],
    },
    {
      name: 'Web Development',
      description: 'Building modern websites and web applications.',
      children: [
        { name: 'Frontend', description: 'UI/UX and browser-based development.' },
        { name: 'Backend', description: 'Server-side logic and database interaction.' },
        { name: 'Fullstack', description: 'Combining both frontend and backend skills.' },
      ],
    },
    {
      name: 'Cybersecurity',
      description: 'Protecting systems and data from threats.',
      children: [
        { name: 'Network Security', description: 'Securing communication channels.' },
        { name: 'Application Security', description: 'Securing software and code.' },
        { name: 'Ethical Hacking', description: 'Simulated attacks to find weaknesses.' },
      ],
    },
  ];

  return (
    <div className="w-full bg-white py-5 border-0">
      <div className="flex justify-center items-center text-[#333333]">
        <div className="max-w-[1234px] flex justify-between items-center w-full ">
          <div className="flex items-center pr-2.5">
            <FaBlogger className="text-[70px]" />
            <span className="font-bold text-3xl">TECHNEWS</span>
          </div>
          <div className="flex-1 pr-5"><SearchBar /></div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1 flex items-center text-[16px] gap-5">
              <li><a>Blog</a></li>
              <li><a>About</a></li>
              <li>
                <Button title="Contact Us" classNames="w-[180px] h-[56px]" />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-[1234px] mx-auto text-black w-full flex items-center justify-between relative mt-2.5">
        {categoriesData.length > 0 && (
          <Categories items={categoriesData} />
        )}
      </div>
    </div>
  )
}
export default HeaderLayout;