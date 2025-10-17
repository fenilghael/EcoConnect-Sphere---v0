import { useState } from 'react';
import { Award, Star, Trophy, Target, Users, Zap, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

export function BadgesScreen() {
  const [selectedBadge, setSelectedBadge] = useState<any>(null);

  const earnedBadges = [
    {
      id: 1,
      name: 'First Step',
      icon: '🌱',
      description: 'Attended your first sustainability event',
      category: 'participation',
      rarity: 'common',
      earned: '2024-03-20',
      points: 10,
      requirements: 'Attend 1 event'
    },
    {
      id: 2,
      name: 'Tree Guardian',
      icon: '🌳',
      description: 'Planted 10+ trees to help combat climate change',
      category: 'environmental',
      rarity: 'uncommon',
      earned: '2024-04-15',
      points: 25,
      requirements: 'Plant 10 trees'
    },
    {
      id: 3,
      name: 'Ocean Protector',
      icon: '🌊',
      description: 'Participated in 5 beach cleanup events',
      category: 'environmental',
      rarity: 'uncommon',
      earned: '2024-05-10',
      points: 30,
      requirements: 'Join 5 beach cleanups'
    },
    {
      id: 4,
      name: 'Repair Champion',
      icon: '🔧',
      description: 'Fixed 20+ items at repair cafés',
      category: 'repair',
      rarity: 'rare',
      earned: '2024-06-05',
      points: 40,
      requirements: 'Repair 20 items'
    },
    {
      id: 5,
      name: 'Impact Maker',
      icon: '⭐',
      description: 'Reached 200+ impact points',
      category: 'achievement',
      rarity: 'rare',
      earned: '2024-07-01',
      points: 50,
      requirements: 'Earn 200 impact points'
    },
    {
      id: 6,
      name: 'Community Leader',
      icon: '👥',
      description: 'Organized 3+ successful events',
      category: 'leadership',
      rarity: 'epic',
      earned: '2024-08-15',
      points: 75,
      requirements: 'Organize 3 events'
    },
    {
      id: 7,
      name: 'Waste Warrior',
      icon: '♻️',
      description: 'Collected 100+ pounds of waste',
      category: 'environmental',
      rarity: 'rare',
      earned: '2024-09-10',
      points: 45,
      requirements: 'Collect 100 lbs of waste'
    },
    {
      id: 8,
      name: 'Green Advocate',
      icon: '🌿',
      description: 'Invited 10+ friends to join the platform',
      category: 'social',
      rarity: 'uncommon',
      earned: '2024-09-25',
      points: 35,
      requirements: 'Invite 10 friends'
    }
  ];

  const availableBadges = [
    {
      id: 9,
      name: 'Carbon Crusher',
      icon: '🌍',
      description: 'Help save 5 tons of CO2 equivalent',
      category: 'environmental',
      rarity: 'epic',
      progress: 60,
      points: 100,
      requirements: 'Save 5 tons CO2 equivalent'
    },
    {
      id: 10,
      name: 'Tech Recycler',
      icon: '📱',
      description: 'Participate in 3 e-waste collection events',
      category: 'technology',
      rarity: 'uncommon',
      progress: 33,
      points: 30,
      requirements: 'Join 3 e-waste events'
    },
    {
      id: 11,
      name: 'Sustainability Streak',
      icon: '🔥',
      description: 'Attend events for 6 consecutive months',
      category: 'consistency',
      rarity: 'rare',
      progress: 83,
      points: 60,
      requirements: 'Attend events for 6 months'
    },
    {
      id: 12,
      name: 'Master Organizer',
      icon: '🏆',
      description: 'Successfully organize 10 events',
      category: 'leadership',
      rarity: 'legendary',
      progress: 30,
      points: 150,
      requirements: 'Organize 10 events'
    },
    {
      id: 13,
      name: 'Knowledge Sharer',
      icon: '📚',
      description: 'Host 5 educational workshops',
      category: 'education',
      rarity: 'rare',
      progress: 20,
      points: 50,
      requirements: 'Host 5 workshops'
    },
    {
      id: 14,
      name: 'Volunteer Hero',
      icon: '💪',
      description: 'Contribute 100+ volunteer hours',
      category: 'participation',
      rarity: 'epic',
      progress: 75,
      points: 80,
      requirements: 'Volunteer 100+ hours'
    }
  ];

  const achievements = [
    { date: '2024-09-25', badge: 'Green Advocate', action: 'earned' },
    { date: '2024-09-10', badge: 'Waste Warrior', action: 'earned' },
    { date: '2024-08-15', badge: 'Community Leader', action: 'earned' },
    { date: '2024-07-01', badge: 'Impact Maker', action: 'earned' },
    { date: '2024-06-05', badge: 'Repair Champion', action: 'earned' }
  ];

  const stats = {
    totalBadges: earnedBadges.length,
    totalPoints: earnedBadges.reduce((sum, badge) => sum + badge.points, 0),
    rank: 'Environmental Champion',
    nextRank: 'Sustainability Master',
    nextRankPoints: 500,
    categories: {
      participation: earnedBadges.filter(b => b.category === 'participation').length,
      environmental: earnedBadges.filter(b => b.category === 'environmental').length,
      leadership: earnedBadges.filter(b => b.category === 'leadership').length,
      social: earnedBadges.filter(b => b.category === 'social').length,
      repair: earnedBadges.filter(b => b.category === 'repair').length,
      achievement: earnedBadges.filter(b => b.category === 'achievement').length
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'uncommon': return 'bg-green-100 text-green-700 border-green-300';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const BadgeModal = ({ badge, isEarned }: { badge: any, isEarned: boolean }) => (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <BadgeCard badge={badge} isEarned={isEarned} />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="text-6xl mb-2">{badge.icon}</div>
            {badge.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="text-center">
            <Badge className={`${getRarityColor(badge.rarity)} capitalize`}>
              {badge.rarity}
            </Badge>
          </div>
          
          <p className="text-sm text-center text-muted-foreground">
            {badge.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Requirements:</span>
              <span className="text-sm text-muted-foreground">{badge.requirements}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Points:</span>
              <span className="text-sm">{badge.points}</span>
            </div>
            {isEarned && (
              <div className="flex justify-between items-center">
                <span className="text-sm">Earned:</span>
                <span className="text-sm text-[var(--eco-green-600)]">
                  {new Date(badge.earned).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {!isEarned && badge.progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Progress:</span>
                <span className="text-sm">{badge.progress}%</span>
              </div>
              <Progress value={badge.progress} className="h-2" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  const BadgeCard = ({ badge, isEarned }: { badge: any, isEarned: boolean }) => (
    <Card className={`hover:shadow-md transition-shadow ${!isEarned ? 'opacity-70' : ''}`}>
      <CardContent className="p-4 text-center">
        <div className={`text-4xl mb-2 ${!isEarned ? 'grayscale' : ''}`}>
          {badge.icon}
        </div>
        <h3 className="text-sm mb-1">{badge.name}</h3>
        <Badge className={`text-xs ${getRarityColor(badge.rarity)} mb-2`}>
          {badge.rarity}
        </Badge>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {badge.description}
        </p>
        {isEarned ? (
          <div className="text-xs text-[var(--eco-green-600)]">
            {badge.points} points
          </div>
        ) : (
          <div className="space-y-1">
            {badge.progress !== undefined && (
              <>
                <Progress value={badge.progress} className="h-1" />
                <div className="text-xs text-muted-foreground">
                  {badge.progress}% complete
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3">
          <CardContent className="pt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl mb-2">Badge Collection</h1>
                <p className="text-muted-foreground">Track your sustainability achievements and progress</p>
              </div>
              <div className="text-right">
                <div className="text-2xl">{stats.totalBadges}</div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 text-center">
            <Trophy className="h-8 w-8 text-[var(--eco-green-600)] mx-auto mb-2" />
            <div className="text-2xl mb-1">{stats.totalPoints}</div>
            <p className="text-xs text-muted-foreground">Total Points</p>
          </CardContent>
        </Card>
      </div>

      {/* Rank Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="mr-2 h-5 w-5 text-[var(--eco-green-600)]" />
            Current Rank: {stats.rank}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Progress to {stats.nextRank}</span>
              <span className="text-sm">{stats.totalPoints}/{stats.nextRankPoints} points</span>
            </div>
            <Progress value={(stats.totalPoints / stats.nextRankPoints) * 100} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {stats.nextRankPoints - stats.totalPoints} more points needed for next rank
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="earned" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="earned">Earned ({stats.totalBadges})</TabsTrigger>
          <TabsTrigger value="available">Available ({availableBadges.length})</TabsTrigger>
          <TabsTrigger value="achievements">Recent Activity</TabsTrigger>
        </TabsList>

        {/* Earned Badges */}
        <TabsContent value="earned" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {earnedBadges.map((badge) => (
              <BadgeModal key={badge.id} badge={badge} isEarned={true} />
            ))}
          </div>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-[var(--eco-green-50)] rounded-lg">
                  <div className="text-lg">🌱</div>
                  <div className="text-lg">{stats.categories.participation}</div>
                  <p className="text-xs text-muted-foreground">Participation</p>
                </div>
                <div className="text-center p-3 bg-[var(--eco-green-50)] rounded-lg">
                  <div className="text-lg">🌍</div>
                  <div className="text-lg">{stats.categories.environmental}</div>
                  <p className="text-xs text-muted-foreground">Environmental</p>
                </div>
                <div className="text-center p-3 bg-[var(--eco-green-50)] rounded-lg">
                  <div className="text-lg">👥</div>
                  <div className="text-lg">{stats.categories.leadership}</div>
                  <p className="text-xs text-muted-foreground">Leadership</p>
                </div>
                <div className="text-center p-3 bg-[var(--eco-green-50)] rounded-lg">
                  <div className="text-lg">🤝</div>
                  <div className="text-lg">{stats.categories.social}</div>
                  <p className="text-xs text-muted-foreground">Social</p>
                </div>
                <div className="text-center p-3 bg-[var(--eco-green-50)] rounded-lg">
                  <div className="text-lg">🔧</div>
                  <div className="text-lg">{stats.categories.repair}</div>
                  <p className="text-xs text-muted-foreground">Repair</p>
                </div>
                <div className="text-center p-3 bg-[var(--eco-green-50)] rounded-lg">
                  <div className="text-lg">⭐</div>
                  <div className="text-lg">{stats.categories.achievement}</div>
                  <p className="text-xs text-muted-foreground">Achievement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Available Badges */}
        <TabsContent value="available" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-[var(--eco-green-600)]" />
                Badges in Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {availableBadges.map((badge) => (
                  <BadgeModal key={badge.id} badge={badge} isEarned={false} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Earn More Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-[var(--eco-green-50)] rounded-lg">
                  <Calendar className="h-5 w-5 text-[var(--eco-green-600)] mt-0.5" />
                  <div>
                    <h4 className="text-sm">Attend More Events</h4>
                    <p className="text-xs text-muted-foreground">Join sustainability events to earn participation and category-specific badges</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-[var(--eco-green-50)] rounded-lg">
                  <Users className="h-5 w-5 text-[var(--eco-green-600)] mt-0.5" />
                  <div>
                    <h4 className="text-sm">Invite Friends</h4>
                    <p className="text-xs text-muted-foreground">Share the platform with friends to earn social impact badges</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-[var(--eco-green-50)] rounded-lg">
                  <Zap className="h-5 w-5 text-[var(--eco-green-600)] mt-0.5" />
                  <div>
                    <h4 className="text-sm">Organize Events</h4>
                    <p className="text-xs text-muted-foreground">Create your own events to unlock leadership badges</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievement Feed */}
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-[var(--eco-green-600)]" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-[var(--eco-green-50)] rounded-lg">
                    <div className="w-10 h-10 bg-[var(--eco-green-600)] rounded-full flex items-center justify-center">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">You earned the <strong>{achievement.badge}</strong> badge!</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className="bg-[var(--eco-green-100)] text-[var(--eco-green-700)]">
                      New
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-r from-[var(--eco-green-50)] to-[var(--eco-teal-50)] rounded-lg">
                  <div className="text-4xl mb-2">🏆</div>
                  <h3 className="text-lg mb-2">October Green Challenge</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Participate in 5 events this month to earn the "Monthly Champion" badge
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Progress</span>
                      <span className="text-sm">3/5 events</span>
                    </div>
                    <Progress value={60} className="h-3" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}