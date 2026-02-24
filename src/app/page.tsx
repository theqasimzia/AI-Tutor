"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Brain,
  Trophy,
  Users,
  Zap,
  BookOpen,
  ShieldCheck,
  ChevronDown,
  Star,
  Clock,
  Layout,
  MessageSquare
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] overflow-hidden bg-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-100/40 via-white to-white" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-36 md:pb-48 overflow-hidden z-10">
        <div className="container px-4 md:px-6 relative flex flex-col items-center text-center space-y-10 max-w-5xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              <span>Aligns with UK National Curriculum (KS2 & KS3)</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl md:text-7xl lg:text-7xl max-w-4xl leading-[1.1]">
              The Personal Tutor <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                Your Child Deserves.
              </span>
            </h1>

            {/* Subheading */}
            <p className="mx-auto max-w-2xl text-slate-600 md:text-xl leading-relaxed">
              Build confidence in Maths and English with a patient, voice-interactive AI tutor that adapts to your child's unique learning pace.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center"
          >
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 text-base font-semibold rounded-full shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all hover:-translate-y-0.5 bg-violet-600 hover:bg-violet-700 text-white border-0">
                Start Your Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base font-medium rounded-full border-slate-200 bg-white hover:bg-slate-50 text-slate-700">
                View Curriculum
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof - refined */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="pt-8 flex items-center justify-center gap-4 text-sm text-slate-500"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-100 shadow-sm" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 20})`, backgroundSize: 'cover' }} />
              ))}
            </div>
            <div className="flex flex-col items-start">
              <div className="flex text-yellow-500 gap-0.5">
                {[1, 2, 3, 4, 5].map(i => <ShieldCheck key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="font-medium text-slate-700">Recommended by 2,000+ Parents</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section id="features" className="py-24 bg-slate-50 relative z-10">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Education, Reimagined for Engagement.</h2>
            <p className="text-lg text-slate-600">
              We move beyond static videos and multiple-choice quizzes. Our platform listens, understands, and guides students just like a human teacher.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="h-6 w-6 text-violet-600" />}
              title="Voice-First Learning"
              description="Students speak naturally to explain their reasoning, improving verbal fluency and deepening understanding."
            />
            <FeatureCard
              icon={<BookOpen className="h-6 w-6 text-blue-600" />}
              title="Curriculum Aligned"
              description="Every lesson correlates directly to the UK National Curriculum for KS2 and KS3 Maths & English."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6 text-amber-500" />}
              title="Personalized Adaptation"
              description="Our AI adjusts difficulty in real-time. If a student struggles, we offer support; if they excel, we challenge them."
            />
            <FeatureCard
              icon={<Trophy className="h-6 w-6 text-orange-500" />}
              title="Motivating Progress"
              description="Healthy gamification with streaks and XP keeps students coming back without distracting from the learning."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6 text-emerald-600" />}
              title="Parent Peace of Mind"
              description="Weekly digests and real-time dashboards show you exactly what your child has mastered."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6 text-indigo-600" />}
              title="Safe & Private"
              description="Built with privacy-first principles. We never sell data, and voice interactions are secure."
            />
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="curriculum" className="py-24 bg-white relative z-10">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-600 border border-violet-100 uppercase tracking-wider">
                  What we teach
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl leading-tight">
                  Aligned with the <br />
                  <span className="text-violet-600">UK National Curriculum.</span>
                </h2>
                <p className="text-lg text-slate-600 max-w-xl">
                  Our content is professionally mapped to KS2 and KS3 standards, ensuring your child stays ahead in school while building deep conceptual knowledge.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4 hover:border-violet-200 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-violet-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">Mathematics</h3>
                  <ul className="text-sm text-slate-500 space-y-3">
                    <li className="flex items-center gap-2 font-medium text-slate-700">KS2 & KS3 Standards</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Arithmetic & Fractions</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Algebra Foundations</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Geometry & Logic</li>
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4 hover:border-blue-200 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">English Language</h3>
                  <ul className="text-sm text-slate-500 space-y-3">
                    <li className="flex items-center gap-2 font-medium text-slate-700">Reading & Analysis</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Comprehension Skills</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> SPAG Mastery</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Creative Writing</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-violet-200 to-indigo-200 rounded-3xl blur-2xl opacity-30 animate-pulse" />
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl p-4 lg:rotate-2">
                <div className="bg-slate-50 rounded-2xl p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                        <Star className="h-5 w-5 text-amber-500 fill-current" />
                      </div>
                      <div>
                        <div className="h-2 w-24 bg-slate-200 rounded-full mb-2" />
                        <div className="h-2 w-16 bg-slate-100 rounded-full" />
                      </div>
                    </div>
                    <div className="h-8 w-20 bg-violet-600 rounded-full" />
                  </div>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
                      <div className="h-10 w-10 bg-slate-100 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 bg-slate-100 rounded-full" />
                        <div className="h-2 w-1/2 bg-slate-50 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50 relative z-10">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Simple, Monthly Pricing.</h2>
            <p className="text-lg text-slate-600">
              No long-term contracts. Cancel anytime. Choose the plan that fits your family's needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <PricingCard
              title="Mini Scholar"
              price="0"
              description="Perfect for seeing how your child interacts with our AI tutors."
              features={[
                "7-Day Full Access Trial",
                "1 Student Account",
                "Maths & English Content",
                "Real-time Feedback",
                "Parent Dashboard Access"
              ]}
              buttonText="Start Trial"
              href="/signup"
            />
            <PricingCard
              title="Solo Master"
              price="19"
              description="Complete personalized experience for one dedicated student."
              features={[
                "Unlimited AI Tutoring",
                "Full UK Curriculum Mapping",
                "Advanced Progress Analytics",
                "Personalized Learning Path",
                "Priority Support"
              ]}
              buttonText="Get Started"
              href="/signup"
              featured
            />
            <PricingCard
              title="Family Hub"
              price="39"
              description="The smartest choice for families with multiple learners."
              features={[
                "Up to 3 Student Accounts",
                "Individual Learning Paths",
                "Family Progress Overview",
                "Gamified Family Challenges",
                "Specialized Content Packs"
              ]}
              buttonText="Join as Family"
              href="/signup"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-white relative z-10">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              Why we built this
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 leading-[1.2]">
              Bridging the Gap in <span className="text-violet-600">Global Education.</span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              We believe every child deserves the benefits of 1-on-1 tutoring. Our mission is to combine cutting-edge AI with pedagogical best practices to make a world-class education accessible and affordable for everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mt-20 pt-16 border-t border-slate-100">
            <div className="space-y-2">
              <div className="text-5xl font-bold text-slate-900 leading-none">2k+</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">Active Learners</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-slate-900 leading-none">50k+</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">Daily Lessons</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-slate-900 leading-none">98%</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">Improved Scores</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50 relative z-10">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Have Questions?</h2>
            <p className="text-slate-600">Everything you need to know about AI Tutor Academy.</p>
          </div>
          <div className="space-y-4">
            <FAQItem
              question="How does the voice-tutor work?"
              answer="Our platform uses advanced natural language processing to listen to your child explain their reasoning. This promotes metacognition—the process of thinking about one's own thinking—which significantly improves learning retention compared to multiple-choice tests."
            />
            <FAQItem
              question="Is the curriculum really school-aligned?"
              answer="Yes. We have mapped every single lesson to the UK National Curriculum frameworks for Key Stage 2 and Key Stage 3. Whether your child is preparing for SATs or just building core skills, we've got it covered."
            />
            <FAQItem
              question="What device do I need?"
              answer="AI Tutor Academy works on any modern device with a microphone and a web browser. iPads, Chromebooks, and family laptops are all perfect for a smooth learning experience."
            />
            <FAQItem
              question="Can I upgrade or downgrade my plan later?"
              answer="Absolutely. You can change your subscription plan at any time directly from the Parent Dashboard. Changes will take effect in your next billing cycle."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden bg-slate-900 text-white z-10">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-500 via-transparent to-transparent" />
        <div className="container px-4 md:px-6 text-center space-y-10 max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl leading-[1.1]">Join the Future of Personalized Learning.</h2>
          <p className="text-xl text-slate-300">
            Start your child's journey today with a 7-day free trial. Unlock their full potential with their own personal AI tutor.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="rounded-full text-base font-semibold h-14 px-10 bg-white text-slate-900 hover:bg-slate-100 shadow-xl shadow-white/10 hover:-translate-y-1 transition-all">
                Create My Account
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="rounded-full text-base font-semibold h-14 px-10 border-white/20 hover:bg-white/10 text-white">
                Log In
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="h-4 w-4" /> Secure SSL Encryption • No Credit Card Required for Trial
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardHeader className="pb-3">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-violet-50 group-hover:border-violet-100 transition-colors">
            {icon}
          </div>
          <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 leading-relaxed text-sm">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function PricingCard({ title, price, description, features, buttonText, href, featured = false }: any) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${featured
        ? 'border-violet-500 bg-white shadow-2xl scale-[1.02] z-20'
        : 'border-slate-200 bg-white shadow-sm hover:shadow-lg z-10'
        }`}
    >
      {featured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-600 text-white text-[10px] uppercase tracking-[0.2em] font-bold py-1.5 px-4 rounded-full shadow-lg">
          Best Value
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tight text-slate-900">£{price}</span>
          <span className="text-slate-500 font-medium">/month</span>
        </div>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>

      <ul className="space-y-4 mb-10 flex-1">
        {features.map((feature: string) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
            <div className="mt-1 h-4 w-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
            </div>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link href={href}>
        <Button
          className={`w-full h-12 rounded-full font-bold transition-all duration-300 ${featured
            ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200'
            : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
        >
          {buttonText}
        </Button>
      </Link>
    </motion.div>
  )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:border-violet-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-left"
      >
        <span className="font-bold text-slate-900 pr-8">{question}</span>
        <div className={`transition-transform duration-300 rounded-full h-8 w-8 flex items-center justify-center bg-slate-50 ${isOpen ? 'rotate-180 bg-violet-50 text-violet-600' : 'text-slate-400'}`}>
          <ChevronDown className="h-5 w-5" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-6 pt-0 text-slate-600 leading-relaxed text-sm border-t border-slate-50">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
