import { motion } from "framer-motion";
import { Code, Server, Github, Linkedin } from "lucide-react";

const TeamPage = () => {
  const teamMembers = {
    frontend: [
      {
        name: "Akshat Tiwari",
        role: "User-Facing Front-end",
        description:
          "A Computer Science student exploring Cloud Computing and Machine Learning. I love building clean, responsive web apps with React and Tailwind, and turning fresh ideas into something real.",
        image: "/TeamImage/Akshat.png",
        github: "https://github.com/AKranger05",
        linkedin: "https://www.linkedin.com/in/contactakshattiwari05",
      },
      {
        name: "Raj Kumar Verma",
        role: "Admin/Employee Facing Front-end",
        description:
          "B.Tech Computer Science student enthusiastic about front-end development. I enjoy tackling challenges, learning new tools, and turning ideas into practical solutions.",
        image: "/TeamImage/Raj.png",
        github: "https://github.com/Rajkumar-14",
        linkedin: "https://linkedin.com/in/raj-kumar-210a01299",
      },
    ],
    backend: [
      {
        name: "Shivang Rai",
        role: "Back-end Developer",
        description:
          "A B.Tech CSE student specializing in Cloud Computing and Machine Learning, with strong skills as a Full Stack Developer. Passionate about building scalable applications and exploring cutting-edge tech.",
        image: "/TeamImage/Shivang.png",
        github: "https://github.com/shivangrai5143",
        linkedin: "https://linkedin.com/in/shivang-rai-58b45728b",
      },
      {
        name: "Vivek Yadav",
        role: "Back-end Developer",
        description:
          "A Computer Science student passionate about full-stack development. I work with the MERN stack to build interactive web apps and reliable back-end systems.",
        image: "/TeamImage/Vivek.png",
        github: "https://github.com/your-profile", 
        linkedin: "https://linkedin.com/in/your-profile", 
      },
    ],
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  from-black via-violet-900 to-indigo-900 text-white font-sans pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-orange-500 pb-2">
            The Artisans of The Roasting House
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mt-4 max-w-3xl mx-auto">
            Meet the dedicated team of developers and innovators brewing up your
            favorite coffee experience, one line of code at a time.
          </p>
        </motion.header>

        {/* Frontend Section */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold flex items-center gap-3 mb-8 text-slate-200"
          >
            <Code className="text-cyan-400" />
            Front-end Wizards
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {teamMembers.frontend.map((member) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 text-center group"
              >
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-amber-400 transition-all duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-amber-400 font-semibold text-sm mb-3">
                  {member.role}
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {member.description}
                </p>
                <div className="flex justify-center gap-4 mt-6">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                    title="GitHub"
                  >
                    <Github />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Backend Section */}
        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold flex items-center gap-3 mb-8 text-slate-200"
          >
            <Server className="text-fuchsia-400" />
            Back-end Architects
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {teamMembers.backend.map((member) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 text-center group"
              >
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-fuchsia-400 transition-all duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-fuchsia-400 font-semibold text-sm mb-3">
                  {member.role}
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {member.description}
                </p>
                <div className="flex justify-center gap-4 mt-6">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                    title="GitHub"
                  >
                    <Github />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default TeamPage;
