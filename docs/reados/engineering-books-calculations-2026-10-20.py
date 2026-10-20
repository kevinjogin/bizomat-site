"""Reproduce critical teaching-case calculations; Python standard library only.

Run from the repository root:
    python docs/reados/engineering-books-calculations-2026-10-20.py

These checks verify arithmetic under the manuscript's assumed models. They do
not validate real materials, forces, tolerances, equipment or production release.
"""
from itertools import product
from math import sqrt, pi, isclose
from statistics import mean, stdev

checks = 0

def check(label, actual, expected, tolerance=1e-8):
    global checks
    assert isclose(actual, expected, rel_tol=tolerance, abs_tol=tolerance), (label, actual, expected)
    checks += 1

# Fits That Work: independent endpoint enumeration, including thermal/geometry.
def bounds(h, ht, geometry=0, temperature=(20, 60), coating=(0, 0)):
    cases = [
        H*(1+23e-6*(T-20))-C*(1+12e-6*(T-20))-S*(1+12e-6*(T-20))+g-2*t
        for H,C,S,T,g,t in product((h-ht,h+ht),(51.96,52.04),(5.97,6.03),temperature,(-geometry,geometry),coating)
    ]
    return min(cases), max(cases)

for label,args,want in [
    ('A cold',(60,.06,0,(20,20)),(1.87,2.13)),
    ('A hot envelope',(60,.06), (1.87,2.1574488)),
    ('A geometry',(60,.06,.01),(1.86,2.1674488)),
    ('B geometry',(59.98,.04,.01),(1.86,2.127412)),
    ('Shift only',(59.98,.06,.01),(1.84,2.1474304)),
    ('Tighten only',(60,.04,.01),(1.88,2.1474304)),
    ('Coating',(59.98,.04,.01,(20,60),(.008,.012)),(1.836,2.111412)),
]:
    lo,hi=bounds(*args)
    check(label+' minimum',lo,want[0]);check(label+' maximum',hi,want[1])
check('nominal thermal growth', (60*23e-6-58*12e-6)*40,.02736)
check('housing only hot B before geometry',60.02*(1+23e-6*40)-51.96-5.97,2.1452184)
sigmas=[.06/3,.04/3,.03/3]
check('three-sigma independent',3*sqrt(sum(x*x for x in sigmas)),.0781024967590666)
check('three-sigma correlated C/S',3*sqrt(sum(x*x for x in sigmas)+2*.6*sigmas[1]*sigmas[2]),.0868331733843697)
check('uniform standard deviation',sqrt((.06**2+.04**2+.03**2)/3),.04509249752822894)
u=sqrt(.003**2+(.004/sqrt(5))**2+(.0005/sqrt(3))**2+.002**2)
check('standard uncertainty',u,.004035261247222209)
check('expanded uncertainty',2*u,.008070522494444418)
check('acceptance lower',1.85+2*u,1.8580705224944445)
check('acceptance upper',2.15-2*u,2.1419294775055557)
check('radial offset',sqrt(.12**2+.10**2),.15620499351813308)
check('radial remaining margin',.20-sqrt(.12**2+.10**2),.04379500648186693)
A=[1.974,1.976,1.978,1.976,1.976];B=[1.990,1.992,1.994,1.992,1.992]
check('pilot A mean',mean(A),1.976);check('pilot B mean',mean(B),1.992)
check('pilot pooled spread',stdev(A+B),.008537498983243805)
check('hypothetical Cp',(.30)/(6*.02),2.5)
check('hypothetical Cpk',min(2.15-1.99,1.99-1.85)/(3*.02),7/3)
check('zero failure upper bound',1-.05**(1/10),.2588655508930523)
check('allocation first year cost',3000*(.7*60/60+1.2*48/60)+900+6*60,6240)

# Fixtures That Repeat: support equilibrium with clockwise residual couple.
def reactions(clamp,uplift,couple):
    right=(100*clamp-50*uplift+couple)/100
    left=2*clamp-uplift-right
    return left,right
for name,C,U,M,want in [('nominal',500,300,32000,(30,670)),('lost contact',400,300,32000,(-70,570)),('increased clamp',900,300,32000,(430,1070)),('load sensitivity',900,450,48000,(195,1155))]:
    L,R=reactions(C,U,M)
    check(name+' left',L,want[0]);check(name+' right',R,want[1])
check('friction at C500',.15*(2*500-300),105)
check('friction at C900',.15*(2*900-300),225)
check('friction-only clamp total',800/.15+300,5633.333333333333)
check('strap work force',1500*40/60,1000)
check('pad average pressure',900/100,9)
def deflect(L,t):return 900*L**3/(48*200000*(30*t**3/12))
check('bridge I',30*10**3/12,2500)
check('bridge deflection',deflect(100,10),.0375)
check('bridge bending stress',(900*100/4)*5/2500,45)
check('thicker bridge',deflect(100,16),.0091552734375)
check('shorter bridge',deflect(60,10),.0081)
check('series contact deflection',900/60000,.015)
check('combined thicker bridge',deflect(100,16)+900/60000,.0241552734375)
check('milling ideal RPM',1000*120/(pi*20),1909.859317102744)
check('actual cutting speed',pi*20*1900/1000,119.38052083641213)
check('table feed',1900*4*.05,380)
check('ideal travel seconds',120/380*60,18.94736842105263)
check('complete cycle',sum([35,10,12,19,8,10,10,30]),134)
check('cycle improvement percent',(134-130)/134*100,2.9850746268656714)
static=[0,.001,-.001,0,.001,0];reload=[.002,-.001,.003,0,-.002,.001]
check('static spread',stdev(static),.000752772652709081)
check('reload spread',stdev(reload),.0018708286933869708)
check('wear dimensional limit',8.04-2*.03,7.98)
check('wear projected cycles',(7.992-7.990)/((7.998-7.992)/1200),400)
check('wear uncertainty lower',7.992-.003,7.989)
check('spare reorder point',2/4*6+2,5)
saved=(45*60+300*180)-(25*60+300*134)
check('batch seconds saved',saved,15000)
check('batch value',saved/3600*90,375)
check('first year simple balance',12*saved/3600*90-300-3600,600)
check('payback batches',3600/(375-300/12),10.285714285714286)
check('sensitivity first year',12*((20*60+300*20)/3600*90)-300-3600,-1740)
print(f'{checks} calculation checks passed.')
