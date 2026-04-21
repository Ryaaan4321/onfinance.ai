import { prisma } from '@/lib/prisma'
import { serverError } from './apiResponse'
import { notFound } from 'next/navigation';

export async function runSimulation(scenarioId: string) {
    try {
        const scenario = await prisma.scenario.findUnique(
            {
                where: {
                    id: scenarioId
                }
            }
        )
        if (!scenario) {
            return notFound();
        }
        const rule = await prisma.rule.findUnique({
            where: {
                id: scenario.breachedRuleId,
            },
            include: {
                regulation: true
            }
        })
        if (!rule) {
            return notFound();
        }
        const dailyPenalty = rule.penaltyPerDay ?? 10000  // fallback ₹10,000/day
        const rawPenalty = dailyPenalty * scenario.daysOverdue
        const penalty = rule.maxPenalty
            ? Math.min(rawPenalty, rule.maxPenalty)
            : rawPenalty

        const severityWeight = {
            LOW: 1,
            MEDIUM: 2,
            HIGH: 3,
            CRITICAL: 5
        }[rule.severity]
        const riskScore = Math.min(severityWeight * scenario.daysOverdue * 2, 100)
        const violations = [
            {
                ruleId: rule.id,
                description: rule.description,
                severity: rule.severity,
                penaltyApplied: penalty
            }
        ]  
        const result = await prisma.simulationResult.create({
            data: {
                scenarioId,
                violations,
                riskScore,
                penalty
            }
        })

        return result
    } catch (e) {
        serverError(e);
    }
}