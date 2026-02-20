"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Sparkles, Brain, Trophy, Users, Zap, BookOpen, ShieldCheck } from "lucide-react"

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

      {/* Value Proposition Grid - clean and balanced */}
      <section id="features" className="py-24 bg-slate-50 relative z-10">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Education, Reimaged for Engagement.</h2>
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

      {/* Call to Action - Professional */}
      <section className="py-24 relative overflow-hidden bg-slate-900 text-white z-10">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-500 via-transparent to-transparent" />

        <div className="container px-4 md:px-6 text-center space-y-8 max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Invest in Your Child's Future Today.</h2>
          <p className="text-lg text-slate-300">
            Join the leading platform for AI-assisted personalized education.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="rounded-full text-base font-semibold h-14 px-10 bg-white text-slate-900 hover:bg-slate-100">
                Get Started for Free
              </Button>
            </Link>
          </div>
          <p className="text-xs text-slate-500 mt-4">No credit card required for trial.</p>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="h-full border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl overflow-hidden">
      <CardHeader className="pb-3">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
          {icon}
        </div>
        <CardTitle className="text-lg font-bold text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 leading-relaxed text-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
