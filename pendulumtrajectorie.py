import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import odeint


# 1. PARÂMETROS FÍSICOS

L = 0.795          # Comprimento do fio (m)
g = 9.81           # Gravidade (m/s^2)
M = 0.500          # Massa (kg) - Nota: a massa cancela-se nas equações de movimento

# VELOCIDADE ANGULAR DO REFERENCIAL 
OMEGA_ROT = 0.4 # rad/s

# CONDIÇÕES INICIAIS 
x0 = 0.05          # Posição X inicial (m)
y0 = 0.00          # Posição Y inicial (m)
vx0 = 0.0          # Velocidade X inicial (m/s) 
vy0 = 0.0          # Velocidade Y inicial (m/s)

# TEMPO DE SIMULAÇÃO
t_max = 60.0       # Segundos
dt = 0.01          # Passo de tempo
t = np.arange(0, t_max, dt)


# 2. EQUAÇÕES DE MOVIMENTO

def equacoes_movimento(estado, t, omega, L, g):
    x, vx, y, vy = estado
    
    # Frequência natural do pêndulo (w0^2 = g/L)
    w0_sq = g / L
    
    # Acelerações (F = ma) divididas pela massa:
    # ax = -w0^2*x  +  2*omega*vy  +  omega^2*x
    #      (Gravidade) (Coriolis)     (Centrífuga)
    ax = -w0_sq * x + 2 * omega * vy + (omega**2) * x
    
    # ay = -w0^2*y  -  2*omega*vx  +  omega^2*y
    ay = -w0_sq * y - 2 * omega * vx + (omega**2) * y
    
    return [vx, ax, vy, ay]


# 3. RESOLUÇÃO NUMÉRICA

estado_inicial = [x0, vx0, y0, vy0]

solucao = odeint(equacoes_movimento, estado_inicial, t, args=(OMEGA_ROT, L, g))

x_sim = solucao[:, 0]
y_sim = solucao[:, 2]


# 4. PLOT

plt.figure(figsize=(8, 8))

# Trajetória
plt.plot(x_sim, y_sim, label=rf'Trajetória Teórica ($\Omega$={OMEGA_ROT} rad/s)', color='blue')

# Marcar início e fim
plt.plot(x_sim[0], y_sim[0], 'go', label='Início')
plt.plot(x_sim[-1], y_sim[-1], 'ro', label='Fim')

# Estética
plt.title(f'Previsão Teórica da Trajetória no Referencial em Rotação\n(L={L}m, $\\Omega$={OMEGA_ROT} rad/s)')
plt.xlabel('Posição X (m)')
plt.ylabel('Posição Y (m)')
plt.axhline(0, color='black', linewidth=0.5, linestyle='--')
plt.axvline(0, color='black', linewidth=0.5, linestyle='--')
plt.grid(True, linestyle=':', alpha=0.6)
plt.axis('equal') # Importante para ver a forma real da elipse/roseta
plt.legend()

# Mostrar gráfico
plt.tight_layout()
plt.show()