class Plateau {
// Classe du plateau, l'instance est créée dans partie.js.
    constructor (taillePlateau, statKO){
        this.taillePlateau = taillePlateau;
        this.statKO = statKO;
        this.cases = [];
    }

    genererPlateau() {
// Première étape : générer le plateau avec un certain pourcentage de cases inaccessibles.
        for (let x = 0; x < this.taillePlateau; x++) { // On parcourt le plateau sur X
            this.cases[x] = [];
            for (let y = 0; y < this.taillePlateau; y++) { // On parcourt sur Y
                if (Math.floor((Math.random() * this.statKO)) == 0) { // placement des cases inaccessibles avec la stat choisie
                    this.cases[x][y] = new Case(""+x+y, null, true, null, x, y);
                } else {
                    this.cases[x][y] = new Case(""+x+y, null, false, null, x, y); // placement d'une case normale
                  //  console.log(this.cases[x][y]); pour info
                }
            }
        }
        return this.cases;
    }



    casesVides() {
// Cette fonction permet de récupérer les cases qui ne sont pas KO (inaccessibles) et de les stocker dans un Array.
        let casesVides = new Array();
        for (let x = 0; x < this.taillePlateau; x++) {
            for (let y = 0; y < this.taillePlateau; y++) {
                if (this.cases[x][y].caseKO == false) {casesVides.push({ X: x, Y: y });} // On stock les coordonnées des cases obtenues dans l'array casesVides
            }
        }
        return casesVides;
    }

    placementJoueurs() {
// Placement aléatoire des joueurs dans des cases vides.

// Joueur 1
        let casesAccessibles = this.casesVides(); // on place le tableau des cases vides dans une variable casesAccessibles
        let calculPositionJ1 = Math.floor(Math.random() * (casesAccessibles.length)); // On génère une position aléatoire parmi les cases vides
        let positionJ1 = casesAccessibles[calculPositionJ1]; // on stock les coordonnées x-y de la case vide choisie
        this.cases[positionJ1.X][positionJ1.Y].joueur = joueur1; // On place la variable joueur1 (définie dans partie.js) dans l'info de la case
        // étant donné que this.cases = une Case, on peut accéder à la donnée "joueur" de l'instance de cette case
        joueur1.position = this.cases[positionJ1.X][positionJ1.Y]; // dans l'instance joueur1, on inscrit sa position initiale

// Joueur 2, même principe
        let calculPositionJ2 = Math.floor(Math.random() * (casesAccessibles.length));
        let positionJ2 = casesAccessibles[calculPositionJ2];
        this.cases[positionJ2.X][positionJ2.Y].joueur = joueur2;
        joueur2.position = this.cases[positionJ2.X][positionJ2.Y];

// Ce test vérifie ensuite que le joueur 2 n'est pas placé sur les mêmes coordonnées X et Y que le joueur 1
        if (this.cases[positionJ1.X] === this.cases[positionJ2.X] || this.cases[positionJ1.Y] === this.cases[positionJ2.Y]) { // Si la position est la même
            joueur1.position.joueur = null; // On vide la position du joueur1
            joueur2.position.joueur = null; // Idem joueur2
            this.placementJoueurs(); // On relance la fonction depuis le début
            console.log("Placement réinitialisé."); // Pour info, message dans la console. Transparent pour les joueurs.
        }
    }



    placementArmes() {
// On place ici chaque arme sur le plateau les unes après les autres.

        let casesAccessibles = this.casesVides(); // On récupère les cases vides
        let calculPositionArme2 = Math.floor(Math.random() * (casesAccessibles.length)); // On génère une position aléatoire parmi les cases vides
        let positionArme2 = casesAccessibles[calculPositionArme2]; // on stock les coordonnées x-y de la case vide choisie
        this.cases[positionArme2.X][positionArme2.Y].arme = arme2; // on stock l'arme dans la case correspondante

        let calculPositionArme3 = Math.floor(Math.random() * (casesAccessibles.length));
        let positionArme3 = casesAccessibles[calculPositionArme3];
        this.cases[positionArme3.X][positionArme3.Y].arme = arme3;

        let calculPositionArme4 = Math.floor(Math.random() * (casesAccessibles.length));
        let positionArme4 = casesAccessibles[calculPositionArme4];
        this.cases[positionArme4.X][positionArme4.Y].arme = arme4;

        let calculPositionArme5 = Math.floor(Math.random() * (casesAccessibles.length));
        let positionArme5 = casesAccessibles[calculPositionArme5];
        this.cases[positionArme5.X][positionArme5.Y].arme = arme5;
    }

    surlignerCases() {
// Ajout de la classe CSS pour surligner les cases.
        for (let x = 0; x < this.cases.length; x++) {
            for (let y = 0; y < this.cases.length; y++) { // idem
                if (this.cases[x][y].surlignage == true && this.cases[x][y].caseKO == false && this.cases[x][y].joueur == null) { // Si surlignage = true et qu'il ne s'agit ni d'un joueur, ni d'une case KO
                    $('#' + x + y).addClass("surlignage"); // On ajoute la classe CSS .surlignage à la case avec l'ID qui correspond
                }
                else {
                    this.cases[x][y].surlignage = false; // Le surlignage = false
                }
            }
        }
    }



    effacerPlateau() {
// À chaque tour, le plateau est nettoyé afin d'y mettre les nouvelles valeurs. Transparent pour le joueur.
        for (let x = 0; x < this.cases.length; x++) {
          for (let y = 0; y < this.cases.length; y++) {
            $(".tableauPlateau").empty();
            $('#joueur1sante').empty();
            $('#joueur2sante').empty();
            $('#joueur1arme').empty();
            $('#joueur2arme').empty();
            $('#joueur1degats').empty();
            $('#joueur2degats').empty();
            this.cases[x][y].surlignage = false;
        }
      }
    }

    insertionHTML() {
// À chaque tour, on lance l'effacement du plateau puis on y inscrit toutes les valeurs actualisées.
        this.effacerPlateau();
        let plateau = this.cases;
        for (let x = 0; x < this.cases.length; x++) {
            var tableauPlateau = $('<tr class="tableauPlateau"></tr>').attr('id', "x"+x); // Création ligne avec l'id "x" (donc ça commence par x0)
            for (let y = 0; y < this.cases.length; y++) {
                tableauPlateau.append(function(){ // dans chaque ligne, on place en jquery les éléments qui suivent :
                    let contenuCase = "<td id="+ x + y +"></td>"; // variable pour le contenu d'une case
                    let caseKOImg = '<img src="icones/caseKO.png" alt="caseKO">'; // variable pour l'image d'une case KO
                    if (plateau[x][y].caseKO == true) { // on test si la case est KO
                        contenuCase = "<td id=" + x + y + "class=>" + caseKOImg +"</td>";
                    }
                    if (plateau[x][y].arme == arme1) { // test si elle contient l'arme 1
                        contenuCase = "<td id="+ x + y + ">" + arme1.nomImage +"</td>";
                    }
                    if (plateau[x][y].arme == arme2) { //  etc.
                        contenuCase = "<td id=" + x + y + ">" + arme2.nomImage +"</td>";
                    }
                    if (plateau[x][y].arme == arme3) {
                        contenuCase = "<td id=" + x + y + ">" + arme3.nomImage +"</td>";
                    }
                    if (plateau[x][y].arme == arme4) {
                        contenuCase = "<td id=" + x + y + ">" + arme4.nomImage +"</td>";
                    }
                    if (plateau[x][y].arme == arme5) {
                        contenuCase = "<td id=" + x + y + ">" + arme5.nomImage +"</td>";
                    }
                    if (plateau[x][y].joueur == joueur1) { // test si la cellule contient joueur 1
                        contenuCase = "<td id=" + x + y + " class=\"case-joueur\">" + joueur1.nomImage +"</td>";
                    }
                    if (plateau[x][y].joueur == joueur2) { // idem pour joueur 2
                        contenuCase = "<td id=" + x + y + " class=\"case-joueur\">" + joueur2.nomImage +"</td>";
                    }
                    return contenuCase;
                });
            }
            $('#tableau-jeu').append(tableauPlateau); // on place tout ce qui a été généré
        }
        // On place ici les statistiques des joueurs.
        $('#barre-sante1').attr('value',joueur1.sante);
        $('#barre-sante2').attr('value',joueur2.sante);
        $('#joueur1sante').append(joueur1.sante);
        $('#joueur2sante').append(joueur2.sante);
        $('#joueur1arme').append(joueur1.arme.nomImage);
        $('#joueur2arme').append(joueur2.arme.nomImage);
        $('#joueur1degats').append(joueur1.arme.degats);
        $('#joueur2degats').append(joueur2.arme.degats);
    }




};

// La classe pour définir une case
class Case {
  constructor(id, arme, caseKO, joueur, X, Y) {
    this.id = id;
    this.arme = arme;
    this.caseKO = caseKO;
    this.joueur = joueur;
    this.surlignage = false;
    this.positionX = X;
    this.positionY = Y;
  }
}
