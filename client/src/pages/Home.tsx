import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
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
} from "lucide-react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
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
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-6">
              Visual HTML Editor
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              A powerful, browser-based HTML editor that lets you design and customize web pages visually, with real-time preview and code synchronization.
            </p>
            <Link href="/editor">
              <a className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all hover:gap-3">
                Start Editing <MousePointer2 className="w-4 h-4" />
              </a>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Paintbrush,
                title: "Visual Editing",
                description: "Edit your HTML visually with an intuitive drag-and-drop interface."
              },
              {
                icon: Code,
                title: "Real-time Code View",
                description: "See your HTML code update in real-time as you make visual changes."
              },
              {
                icon: Layers,
                title: "Component Library",
                description: "Access a rich library of pre-built components to speed up development."
              },
              {
                icon: Upload,
                title: "Import HTML",
                description: "Import existing HTML files and edit them visually."
              },
              {
                icon: Download,
                title: "Export Code",
                description: "Export your design as clean, production-ready HTML code."
              },
              {
                icon: LayoutGrid,
                title: "Responsive Preview",
                description: "Preview your design across different device sizes."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-primary text-primary-foreground rounded-2xl p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Creating Your Web Pages Today
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Jump right in and experience the power of visual HTML editing. No account required.
            </p>
            <Link href="/editor">
              <a className="inline-flex items-center gap-2 px-8 py-4 bg-background text-foreground rounded-md hover:bg-accent transition-colors">
                Open Editor <Zap className="w-4 h-4" />
              </a>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <PenTool className="h-5 w-5" />
            <span className="font-medium">Visual HTML Editor</span>
          </div>
          <p className="text-sm">
            Built with modern web technologies for an optimal editing experience.
          </p>
        </div>
      </footer>
    </div>
  );
}
