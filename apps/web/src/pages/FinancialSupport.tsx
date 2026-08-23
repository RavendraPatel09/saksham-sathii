import React from 'react';
import { Landmark, PiggyBank, Receipt, TrendingUp, HandCoins, AlertCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const FinancialSupport = () => {
  const budgetData = [
    { name: 'Income', amount: 45000 },
    { name: 'Expenses', amount: 28000 },
    { name: 'Savings', amount: 17000 },
  ];

  const expenseData = [
    { name: 'Housing', value: 12000, color: '#3B82F6' },
    { name: 'Healthcare', value: 5000, color: '#10B981' },
    { name: 'Food', value: 8000, color: '#F59E0B' },
    { name: 'Transport', value: 3000, color: '#8B5CF6' },
  ];

  const schemes = [
    { name: "Sugamya Bharat Abhiyan", type: "Government", tag: "Eligible", amount: "₹5,000/mo" },
    { name: "Skill India Disability Grant", type: "Grant", tag: "Eligible", amount: "₹25,000" },
    { name: "National Scholarship Portal", type: "Scholarship", tag: "Action Required", amount: "₹50,000/yr" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Landmark className="w-10 h-10 text-primary" /> Financial & Benefits Hub
        </h1>
        <p className="text-xl text-muted-foreground">Manage your finances, track expenses, and discover eligible government schemes.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
          <Card className="premium-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-64 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fill: '#888'}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Receipt className="w-5 h-5 text-primary" /> Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-64 pt-4 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-4">
                <span className="text-xl font-bold">₹28k</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="premium-card h-fit bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" /> Smart Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm border text-sm">
              <span className="font-semibold text-emerald-500">Good News!</span> You may qualify for the <strong>Skill India Disability Grant</strong> based on your recent course completions.
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm border text-sm">
              <span className="font-semibold text-blue-500">Suggestion:</span> Your healthcare expenses are below average this month. Consider adding to your emergency savings.
            </div>
            <Button className="w-full mt-2"><PiggyBank className="w-4 h-4 mr-2" /> Add to Savings</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <HandCoins className="w-6 h-6 text-primary" /> Eligible Schemes & Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {schemes.map((scheme, i) => (
              <div key={i} className="p-4 border rounded-xl bg-background/50 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant={scheme.tag === 'Eligible' ? 'default' : 'destructive'} className={scheme.tag === 'Eligible' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                    {scheme.tag}
                  </Badge>
                  <span className="text-sm font-semibold text-primary">{scheme.amount}</span>
                </div>
                <h3 className="font-bold mb-1">{scheme.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{scheme.type}</p>
                <Button variant="outline" size="sm" className="w-full"><FileText className="w-4 h-4 mr-2" /> Apply Now</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
