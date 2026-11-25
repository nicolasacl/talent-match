"""
Módulo de Motor de Emparejamiento - TalentoMatch Pro
Laboratorio 8: Calidad y Mantenimiento
Desarrollado por: Nicolás Cedeño
"""

CARGOS_AVANZADOS_PYTHON = [
    "Jefe de Operaciones · Operaciones",
    "Analista de Datos Senior · Tecnología",
    "Business Partner de Personas · Recursos Humanos",
    "Controller Financiero · Finanzas"
]

def validar_experiencia_candidato() -> int:
    while True:
        try:
            entrada = input("Ingrese los años de experiencia del candidato: ")
            experiencia = int(entrada)
            if experiencia < 0 or experiencia > 40:
                print("Error: Ingrese un valor de años coherente (0 - 40).")
                continue
            return experiencia
        except ValueError:
            print("Error de ejecución: Debe ingresar un valor numérico entero.")

def calcular_indice_matching(experiencia_candidato: int, experiencia_minima_requerida: int) -> float:
    if experiencia_minima_requerida <= 0:
        return 100.0
    porcentaje = (experiencia_candidato / experiencia_minima_requerida) * 100.0
    return round(min(porcentaje, 100.0), 2)

if __name__ == "__main__":
    print("=== MOTOR DE MATCHING TALENTOMATCH PRO (PYTHON) ===")
    for idx, cargo in enumerate(CARGOS_AVANZADOS_PYTHON, start=1):
        print(f"{idx}. {cargo}")