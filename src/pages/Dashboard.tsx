import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { BadgeCard } from '@/components/BadgeCard';
import { ProgressBar } from '@/components/ProgressBar';
import { useGamification } from '@/hooks/useGamification';
import { useContentManager } from '@/hooks/useContentManager';
import { badges } from '@/data/badges';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, BookOpen, Star, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Dashboard = () => {
  const gamification = useGamification();
  const content = useContentManager();
  
  // Get all content items
  const allContent = content.getAllContent();
  
  // Set total lessons count for progress calculation
  useEffect(() => {
    gamification.setTotalLessonsCount(allContent.length);
  }, [allContent.length]);
  
  const progress = gamification.getProgress();
  const earnedBadges = gamification.getEarnedBadgesData();
  
  // Get completed lessons data from content
  const completedLessonsData = allContent.filter((item) => 
    gamification.completedLessons.includes(item.id)
  );

  return (
    <div className="min-h-screen gradient-hero">
      <Header totalPoints={gamification.totalPoints} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Stats */}
        <section className="mb-10">
          <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            My Progress Dashboard 🏆
          </h1>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Points */}
            <Card className="shadow-card border-0 bg-gradient-to-br from-gold/20 to-gold/5">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/30 text-2xl">
                  <Star className="h-7 w-7 text-gold-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                  <p className="text-3xl font-bold text-gold-foreground">{gamification.totalPoints}</p>
                </div>
              </CardContent>
            </Card>

            {/* Completed Lessons */}
            <Card className="shadow-card border-0 bg-gradient-to-br from-success/20 to-success/5">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/30 text-2xl">
                  <BookOpen className="h-7 w-7 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Lessons Done</p>
                  <p className="text-3xl font-bold text-success">{progress.completed}</p>
                </div>
              </CardContent>
            </Card>

            {/* Badges Earned */}
            <Card className="shadow-card border-0 bg-gradient-to-br from-accent/20 to-accent/5">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/30 text-2xl">
                  <Trophy className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Badges Earned</p>
                  <p className="text-3xl font-bold text-accent">{earnedBadges.length}</p>
                </div>
              </CardContent>
            </Card>

            {/* Progress Percentage */}
            <Card className="shadow-card border-0 bg-gradient-to-br from-primary/20 to-primary/5">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/30 text-2xl">
                  📈
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion</p>
                  <p className="text-3xl font-bold text-primary">{progress.percentage}%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Progress Bar */}
        <section className="mb-10 rounded-2xl bg-card p-6 shadow-card">
          <h2 className="mb-4 text-xl font-bold text-foreground">Overall Progress</h2>
          <ProgressBar
            completed={progress.completed}
            total={progress.total}
            size="lg"
            color="success"
          />
        </section>

        {/* Badges Section */}
        <section className="mb-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">My Badges</h2>
            <span className="rounded-full bg-accent/20 px-3 py-1 text-sm font-bold text-accent">
              {earnedBadges.length} / {badges.length} unlocked
            </span>
          </div>

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {badges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isEarned={gamification.isBadgeEarned(badge.id)}
                size="sm"
              />
            ))}
          </div>
        </section>

        {/* Recently Completed */}
        <section className="mb-10">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Recently Completed</h2>

          {completedLessonsData.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {completedLessonsData.slice(-6).reverse().map((lesson) => (
                <Card key={lesson.id} className="shadow-card border-success/30 bg-success-light/30">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/20 text-2xl">
                      {lesson.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{lesson.title}</p>
                      <p className="text-sm text-muted-foreground">+{lesson.points} pts</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <div className="mb-4 text-5xl">📚</div>
                <h3 className="text-lg font-bold text-foreground">No lessons completed yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Start learning to see your progress here!
                </p>
                <Button asChild className="mt-4 gradient-primary shadow-button">
                  <Link to="/">Start Learning</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Reset Progress */}
        <section className="flex justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="gap-2 text-muted-foreground">
                <RotateCcw className="h-4 w-4" />
                Reset All Progress
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all your progress, points, and badges. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => gamification.resetProgress()}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Reset Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
