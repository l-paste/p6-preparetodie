class Joueur{
// Classe "joueur", deux instances créées dans partie.js (variables joueur1 et player2).
    constructor(nom, sante, arme, nomImage){
        this.nom = nom;
        this.sante = sante;
        this.arme = arme;
        this.position = null;
        this.defense = false;
        this.nomImage = nomImage;
    }

    defendre() {
// Au clic sur "Défendre", on change la valeur de this.defense en true (elle sera utilisée ci-dessous pendant l'encaissement des dégats).
        this.defense = true;
        return this.defense;
    }

    blessure(degats) {
// Fonction pour gérer les blessures : s'il se défend, on divise les dégats par deux, sinon il encaisse TOUT. Dégats définis par l'arme.
        if (this.defense == true){
            this.sante = this.sante - (degats/2); // Divise par 2 si défense.
            this.defense = false;
        }
        else {
            this.sante = this.sante - degats;
        }
    }

    attaquer(ennemi) {
// Gestion de l'attaque.
        ennemi.blessure(this.arme.degats);
        return true;
    }

}
