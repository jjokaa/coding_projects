import pandas as pd
import matplotlib.pyplot as plt
import io

#Este script tem como objetivo ler dados experimentais vindos do excel, transformar num formato em qual o python consegue ler e traçar osg gráficos de posição em função do tempo.

# 1. INSERIR DADOS (t(s), x(m), y(m))

DADOS_RAW = """

Inserir Dados Aqui

"""


# 2. LER OS DADOS

def ler_dados(texto):
    try:
        # Substitui vírgula por ponto 
        texto = texto.replace(',', '.')
        # Lê como CSV usando espaço ou tabulação como separador
        df = pd.read_csv(io.StringIO(texto), sep=r'\s+', header=None, names=['t', 'x', 'y'])
        # Garante que são números e remove erros
        return df.apply(pd.to_numeric, errors='coerce').dropna().reset_index(drop=True)
    except Exception as e:
        print(f"Erro ao ler dados: {e}")
        return pd.DataFrame()


# 3. PRINT

df = ler_dados(DADOS_RAW)

if not df.empty:
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8), sharex=True)
    
    # Gráfico X vs Tempo
    ax1.plot(df['t'], df['x'], 'b.-', label='Posição X')
    ax1.set_ylabel('X(m)')
    ax1.set_title('X(t) e Y(t)')
    ax1.grid(True)
    ax1.legend()
    
    # Gráfico Y vs Tempo
    ax2.plot(df['t'], df['y'], 'r.-', label='Posição Y')
    ax2.set_xlabel('t(s)')
    ax2.set_ylabel('Y(m)')
    ax2.grid(True)
    ax2.legend()
    
    plt.tight_layout()
    plt.show()
else:
    print("Erro: Não foi possível ler os dados.")