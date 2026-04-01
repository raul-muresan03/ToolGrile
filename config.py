QUIZ_BASE_DIR = "final"  
OUTPUT_SIMULATION_DIR = "simulari_generate"
BAREM_BASE_DIR = "baremuri"

# Criterii de selecție
NUM_BIO_QUIZZES = 35
NUM_CHIMIE_TEORIE_QUIZZES = 10
NUM_CHIMIE_PROBLEME_QUIZZES = 5

# bio
# cap1_corpul_uman_celula
# cap2_oasele_articulatiile
# cap3_tesuturi_excitabile
# cap4_sistemul_nervos
# cap5_organe_de_simt
# cap6_sistemul_endocrin_metabolism
# cap7_sangele
# cap8_sistemul_circulator
# cap9_sistemul_respirator
# cap10_sistemul_digestiv
# cap11_sistemul_urinar
# cap12_sistemul_reproducator
# cap13_intrebari_asociative_recap
BIOLOGY_CHAPTER_WEIGHTS = {
    # 1: 0,
    # 2: 0,
    # 3: 0,
    # 4: 0,
    # 5: 0,
    # 6: 0,
    # 7: 0,
    # 8: 0,
    # 9: 0,
    # 10: 0,
    # 11: 0,
    # 12: 0,
    # 13: 1,

    # Dacă un capitol nu este listat, va avea ponderea implicită 1.0.
    # 1 - basic, 0.5 - sanse la jumatate, 2 - sanse duble
}

# ----------------------------------------

# chimie
# cap1_solutii_acizi_baze
# cap2_compozitia_structura_compusilor_organici
# cap3_compusi_hidroxilici
# cap4_amine
# cap5_aldehide_cetone
# cap6_acizi_carboxilici
# cap7_proteine
# cap8_glucide
# cap9_medicamente_droguri
# cap10_izomerie
# cap11_grile_asociative_recap

CHEMISTRY_CHAPTER_WEIGHTS_TEORIE = {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1,
    7: 1,
    8: 1,
    9: 1,
    10: 1,
    11: 1,
}

CHEMISTRY_CHAPTER_WEIGHTS_PROBLEME = {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1,
    7: 1,
    8: 1,
    9: 1,
    10: 1,
    11: 1,
}
