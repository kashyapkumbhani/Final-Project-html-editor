import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Laptop,
  Paintbrush,
  Code,
  Zap,
  Upload,
  Download,
  LayoutGrid,
  MousePointer2,
  ArrowRight,
  Sparkles,
  Layers,
  Box,
  Monitor,
  GanttChart,
  GitBranch,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden selection:bg-purple-500/30 selection:text-white">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute w-[1000px] h-[1000px] bg-purple-900/30 opacity-20 blur-[120px] top-[-400px] left-[-300px] rounded-full animate-pulse" />
        <div className="absolute w-[800px] h-[800px] bg-cyan-800/30 opacity-20 blur-[100px] bottom-[-200px] right-[-300px] rounded-full animate-pulse" />
        
        {/* Geometric Shapes */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3B1F6E,transparent)]" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 border border-purple-500/20 rounded-full" />
          <div className="absolute top-3/4 right-1/4 w-64 h-64 border border-cyan-500/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-purple-500/10 rounded-full" />
        </div>
        
        {/* Grid Lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #ffffff05 1px, transparent 1px),
                           linear-gradient(to bottom, #ffffff05 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Laptop className="h-7 w-7 text-purple-400" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-1 bg-purple-500/20 rounded-full blur-sm"
              />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Visual HTML Editor
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/editor" className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200" />
              <button className="relative px-6 py-2 bg-white/5 border border-white/10 rounded-lg font-medium text-sm text-white hover:text-white/90 transition-colors group-hover:border-white/20">
                Launch Editor
              </button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen pt-32 pb-24 px-6 relative z-10 flex items-center">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className="text-left space-y-8">
              <motion.h1 
                variants={fadeInUp}
                className="text-6xl lg:text-7xl xl:text-8xl font-bold"
              >
                <span className="block bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  Visual HTML Editor
                </span>
                <span className="block mt-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  for Modern Web
                </span>
              </motion.h1>
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-white/70 max-w-xl"
              >
                Design and edit HTML visually with real-time preview, intuitive controls, and instant code generation.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <Link href="/editor" className="group relative px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-black font-semibold text-lg inline-flex items-center gap-2 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
                  Start Creating <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="px-8 py-3 bg-white/5 rounded-xl border border-white/10 font-semibold text-lg hover:bg-white/10 transition-colors">
                  Learn More
                </button>
              </motion.div>
            </div>
            <motion.div
              variants={fadeInUp}
              className="relative lg:h-[600px] rounded-2xl border border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Monitor className="w-32 h-32 text-white/20 group-hover:text-white/30 transition-colors" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-4 mb-24"
          >
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Everything you need to create stunning web designs with ease
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MousePointer2,
                title: "Drag & Drop Interface",
                description: "Intuitive drag-and-drop functionality for effortless design creation",
                gradient: "from-purple-500/20 to-purple-600/20"
              },
              {
                icon: Sparkles,
                title: "Real-Time Preview",
                description: "See your changes instantly as you make them",
                gradient: "from-cyan-500/20 to-cyan-600/20"
              },
              {
                icon: Code,
                title: "Clean Code Export",
                description: "Generate production-ready HTML code automatically",
                gradient: "from-purple-500/20 to-purple-600/20"
              },
              {
                icon: Layers,
                title: "Component Library",
                description: "Pre-built components to speed up your workflow",
                gradient: "from-cyan-500/20 to-cyan-600/20"
              },
              {
                icon: Box,
                title: "Responsive Design",
                description: "Create layouts that work perfectly on all devices",
                gradient: "from-purple-500/20 to-purple-600/20"
              },
              {
                icon: GanttChart,
                title: "Advanced Grid System",
                description: "Powerful grid controls for pixel-perfect layouts",
                gradient: "from-cyan-500/20 to-cyan-600/20"
              }
            ].map((feature, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={index}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative h-full p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/5 rounded-xl">
                      <feature.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-white/60">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-4 mb-24"
          >
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Streamlined Workflow
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Design, edit, and export with unprecedented ease
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Design",
                description: "Start with our intuitive visual editor",
                icon: Paintbrush
              },
              {
                step: "02",
                title: "Preview",
                description: "Test your design across all devices",
                icon: Monitor
              },
              {
                step: "03",
                title: "Export",
                description: "Generate clean, optimized code",
                icon: GitBranch
              }
            ].map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                key={index}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-bold text-white/20">{item.step}</span>
                    <item.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-white/60">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
            <div className="relative bg-black/50 border border-white/10 rounded-3xl backdrop-blur-sm p-12 lg:p-24 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
              <div className="relative max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-4xl lg:text-6xl font-bold">
                  Start Creating{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Today
                  </span>
                </h2>
                <p className="text-xl text-white/70">
                  Join thousands of developers who are already using Visual HTML Editor to streamline their workflow
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/editor" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-black font-semibold text-lg inline-flex items-center gap-2 transition-all hover:scale-105">
                    Launch Editor <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Laptop className="h-6 w-6 text-purple-400" />
                <span className="font-bold text-lg">Visual HTML Editor</span>
              </div>
              <p className="text-white/60 text-sm">
                The next generation HTML editor for modern web development
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Features", "Workflow", "Pricing", "Documentation"]
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"]
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security"]
              }
            ].map((column, index) => (
              <div key={index} className="space-y-4">
                <h4 className="font-semibold text-white">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-white/60 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/40">
            <p>&copy; {new Date().getFullYear()} Visual HTML Editor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
