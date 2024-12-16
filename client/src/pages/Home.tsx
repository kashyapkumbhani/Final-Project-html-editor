import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Laptop,
  Paintbrush,
  Code,
  Layers,
  Zap,
  Upload,
  Download,
  LayoutGrid,
  MousePointer2,
  PenTool,
  PlayCircle,
  Star,
  Clock,
  Users,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Web Designer",
    quote: "Transformed my workflow! The visual editing capabilities are incredible.",
    avatar: "SJ"
  },
  {
    name: "Mike Chen",
    role: "Frontend Developer",
    quote: "The best HTML editor for web designers I've ever used.",
    avatar: "MC"
  },
  {
    name: "Emily Davis",
    role: "UI/UX Designer",
    quote: "Perfect balance of visual editing and code control.",
    avatar: "ED"
  }
];

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Laptop className="h-6 w-6 text-primary" />
            <span className="font-semibold text-xl">Visual HTML Editor</span>
          </div>
          <Link href="/editor">
            <a className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              Open Editor
            </a>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
        <div className="container mx-auto max-w-6xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-6">
              Design, Edit, and Export HTML Visually
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Simplify HTML editing with real-time preview, drag-and-drop features, and responsive design tools. All in one powerful browser-based editor.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/editor">
                <a className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all hover:gap-3 text-lg font-medium">
                  Start Editing <MousePointer2 className="w-5 h-5" />
                </a>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="inline-flex items-center gap-2"
              >
                <PlayCircle className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">Everything you need to create beautiful web pages</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Paintbrush,
                title: "Visual Editing",
                description: "Effortless drag-and-drop editing with real-time preview."
              },
              {
                icon: Code,
                title: "Real-time Code View",
                description: "See your HTML code update instantly as you make visual changes."
              },
              {
                icon: Layers,
                title: "Component Library",
                description: "Access a rich library of pre-built components to speed up development."
              },
              {
                icon: Upload,
                title: "Import HTML",
                description: "Import existing HTML files and continue editing visually."
              },
              {
                icon: Download,
                title: "Export Code",
                description: "Export your design as clean, production-ready HTML code."
              },
              {
                icon: LayoutGrid,
                title: "Responsive Preview",
                description: "Preview and optimize your design across all devices."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105"
              >
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-lg text-muted-foreground">Designed for both beginners and professionals</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Faster Workflow",
                description: "Complete projects in a fraction of the time with our intuitive interface."
              },
              {
                icon: Users,
                title: "For Everyone",
                description: "Beginner-friendly yet powerful enough for experienced developers."
              },
              {
                icon: Sparkles,
                title: "Modern & Lightweight",
                description: "Built with the latest web technologies for optimal performance."
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">What Users Say</h2>
            <p className="text-lg text-muted-foreground">Join thousands of satisfied users</p>
          </motion.div>
          <div className="relative h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xl mb-6 italic">"{testimonials[currentTestimonial].quote}"</p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                      <div className="text-sm text-muted-foreground">{testimonials[currentTestimonial].role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-2xl p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Creating Your Web Pages Today
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Jump right in and experience the power of visual HTML editing. No account required.
            </p>
            <Link href="/editor">
              <a className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-md hover:bg-gray-50 transition-colors text-lg font-medium group">
                Open Editor 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PenTool className="h-6 w-6 text-primary" />
                <span className="font-semibold text-xl">Visual HTML Editor</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Built with modern web technologies for an optimal editing experience.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Visual Editing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Real-time Preview</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Code Export</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Component Library</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Tutorials</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">GitHub</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Twitter</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Discord</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Visual HTML Editor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
