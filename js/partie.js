class Partie {
  // Classe pour gérer la partie, on crée une instance de la carte et on définit le tour 1 (joueur1 en joueur, 2 en ennemi).
  constructor() {
    this.plateauPartie = new Plateau(10, 10);
    this.joueurEnCours = joueur1;
    this.ennemiEnCours = joueur2;
    this.victoire = false;
    this.combat = false;
  }


  definirTour() {
    // Gestion du tour du joueur.
    if (this.joueurEnCours == joueur1) { // On inverse le joueur et l'ennemi.
      this.joueurEnCours = joueur2;
      this.ennemiEnCours = joueur1;
      $(".joueur1").toggle(); // Pour afficher/masquer les stats du joueur dont c'est le tour.
      $(".joueur2").toggle();
    } else if (this.joueurEnCours == joueur2) { // Idem dans l'autre cas.
      this.joueurEnCours = joueur1;
      this.ennemiEnCours = joueur2;
      $(".joueur2").toggle(); // Pour afficher/masquer les stats du joueur dont c'est le tour.
      $(".joueur1").toggle();
    }
  }

  gestionBoutons() {
    // Gestion des boutons dans la fiche du personnage.

    // Initialisation du son d'attaque.
    let sonAttaque = document.createElement("audio");
    sonAttaque.src = "sons/attaque.mp3";
    sonAttaque.volume = 0.1;
    sonAttaque.autoPlay = false;
    sonAttaque.preLoad = true;
    sonAttaque.controls = true;

    // Gestion du clic sur le bouton "Attaquer".
    $(".attaquer").click(function() {
      partieEnCours.combat = partieEnCours.joueurEnCours.attaquer(partieEnCours.ennemiEnCours); // On initialise le combat.
      partieEnCours.gestionTour(); // On lance la gestion du tour.
      sonAttaque.play(); // Lecture du son d'attaque.
    });

    // Gestion du clic sur le bouton "Défendre".
    $(".defendre").click(function() {
      partieEnCours.combat = partieEnCours.joueurEnCours.defendre(); // On lance la défense du joueur.
      partieEnCours.gestionTour(); // On lance la gestion du tour.
    });

    // Gestion de l'affichage des règles du jeu.
    $(".regles").click(function() {
      $('#regles').modal('show');
    });
  }

  echangeArme() {
    // Fonction pour changer l'arme du joueur quand il s'arrête sur une case avec arme.
    for (let x = 0; x < this.plateauPartie.cases.length; x++) {
      for (let y = 0; y < this.plateauPartie.cases.length; y++) {
        if (this.plateauPartie.cases[x][y] == this.joueurEnCours.position && this.plateauPartie.cases[x][y].arme != null) { // Si la position du joueur est sur une cellule avec arme.
          let cacheArme = this.plateauPartie.cases[x][y].arme; // On stock le nom de la nouvelle arme dans une variable.
          this.plateauPartie.cases[x][y].arme = this.joueurEnCours.arme; // On met l'ancienne arme du joueur à la place de l'arme prise.
          this.joueurEnCours.arme = cacheArme; // On donne la nouvelle arme au joueur.
        }
      }
    }
  }

  zoneSurlignage(joueurX, joueurY, direction) { // Les paramètres : coordonnées du joueur, la direction.
    // Définition du périmètre de surlignage.
    let limite; // Limite du surlignage.
    switch (direction) {
      case "gauche": // Surlignage des cases à gauche du joueur.
        var x = joueurX;
        var y = joueurY;
        var stop = false; // Arrêt du surlignage
        var perimetreGauche = joueurY - 3; // Nb de cases à surligner sur l'axe y (soustraction car vers la gauche)
        while (y >= 0 && y >= perimetreGauche && !stop) { // Tant qu'on est pas à y-3.
          if (this.plateauPartie.cases[x][y].caseKO == true || this.plateauPartie.cases[x][y].joueur == this.ennemiEnCours) {
            stop = true; // On stop le surlignage si on tombe sur une case KO ou l'autre joueur.
          }
          y--; // On continue vers la gauche jusqu'à y-3.
        }
        limite = y + 1;
        break;
      case "droite":
        var x = joueurX;
        var y = joueurY;
        var stop = false;
        var perimetreDroite = joueurY + 3;
        while (y < this.plateauPartie.cases.length && y <= perimetreDroite && !stop) {
          if (this.plateauPartie.cases[x][y].caseKO == true || this.plateauPartie.cases[x][y].joueur == this.ennemiEnCours) {
            stop = true;
          }
          y++;
        }
        limite = y - 1;
        break;
      case "haut":
        var x = joueurX;
        var y = joueurY;
        var stop = false;
        var perimetreHaut = joueurX - 3;
        while (x >= 0 && x >= perimetreHaut && !stop) {
          if (this.plateauPartie.cases[x][y].caseKO == true || this.plateauPartie.cases[x][y].joueur == this.ennemiEnCours) {
            stop = true;
          }
          x--;
        }
        limite = x + 1;
        break;
      case "bas":
        var x = joueurX;
        var y = joueurY;
        var stop = false;
        var perimetreBas = joueurX + 3;
        while (x < this.plateauPartie.cases.length && x <= perimetreBas && !stop) {
          if (this.plateauPartie.cases[x][y].caseKO == true || this.plateauPartie.cases[x][y].joueur == this.ennemiEnCours) {
            stop = true;
          }
          x++;
        }
        limite = x - 1;
        break;
      default:
        limite = -1;
    }
    return limite;
  }

  casesASurligner() {
    // On applique le surlignage = true
    for (var x = 0; x < this.plateauPartie.cases.length; x++) {
      for (var y = 0; y < this.plateauPartie.cases.length; y++) {
        if (this.plateauPartie.cases[x][y].joueur == this.joueurEnCours) { // Si le joueur dont c'est le tour est sur la case

          let limiteHaut = this.zoneSurlignage(x, y, "haut"); // On récupère la limite vers le haut avec la fonction précédente
          for (var hautX = x; hautX >= limiteHaut; hautX--) {
            this.plateauPartie.cases[hautX][y].surlignage = true;
          } // On passe en "surlignage=true" les cases concernées
          let limiteBas = this.zoneSurlignage(x, y, "bas"); // Idem pour les autres directions.
          for (var basX = x; basX <= limiteBas; basX++) {
            this.plateauPartie.cases[basX][y].surlignage = true;
          }
          let limiteGauche = this.zoneSurlignage(x, y, "gauche");
          for (var gaucheX = y; gaucheX >= limiteGauche; gaucheX--) {
            this.plateauPartie.cases[x][gaucheX].surlignage = true;
          }
          let limiteDroite = this.zoneSurlignage(x, y, "droite");
          for (var droiteX = y; droiteX <= limiteDroite; droiteX++) {
            this.plateauPartie.cases[x][droiteX].surlignage = true;
          }
        }
      }
    }
  }

  mouvementJoueur() {
    // Gestion du déplacement des joueurs sur le plateau.
    for (let x = 0; x < this.plateauPartie.cases.length; x++) {
      for (let y = 0; y < this.plateauPartie.cases.length; y++) {
        $("#" + x + y).click(function(e) { // Au clic sur la case
          if (partieEnCours.plateauPartie.cases[x][y].surlignage == true) { // On vérifie que la case est surlignée
            partieEnCours.joueurEnCours.position.joueur = null; // On vide la variable de position
            partieEnCours.plateauPartie.cases[x][y].joueur = partieEnCours.joueurEnCours; // On place le joueur actuel dans la variable joueur de la cellule.
            partieEnCours.joueurEnCours.position = partieEnCours.plateauPartie.cases[x][y]; // On place la position x y actuel du joueur dans sa variable position.
            partieEnCours.echangeArme(); // On lance la fonction d'échange d'arme si arme il y a sur la case.
            partieEnCours.gestionTour(); // On lance la gestion du tour.
          }
        });
      }
    }
  }

  proximiteJoueur() {
    // Gestion de la proximité avec l'autre joueur.
    var proximite = false; // On initialise la proximité
    for (let x = 0; x < this.plateauPartie.cases.length; x++) {
      for (let y = 0; y < this.plateauPartie.cases.length; y++) {
        if (this.plateauPartie.cases[x][y].joueur == this.joueurEnCours) { // Si la case contient le joueur dont c'est le tour
          // On vérifie sur chaque axe si le joueur adverse est présente à une case près (+1/-1).
          if (x < 9 && this.plateauPartie.cases[x + 1][y].joueur == this.ennemiEnCours) {
            proximite = true;
          } else if (x > 0 && partieEnCours.plateauPartie.cases[x - 1][y].joueur == partieEnCours.ennemiEnCours) {
            proximite = true;
          } else if (y < 9 && partieEnCours.plateauPartie.cases[x][y + 1].joueur == partieEnCours.ennemiEnCours) {
            proximite = true;
          } else if (y > 0 && partieEnCours.plateauPartie.cases[x][y - 1].joueur == partieEnCours.ennemiEnCours) {
            proximite = true;
          }
        }
      }
    }
    return proximite; // On renvoi la proximité.
  }

  gestionProximite() {
    // Quand proximite = true, on rend disponible les fonctions de combat.
    $('.attaquer').removeAttr("disabled");
    $('.defendre').removeAttr("disabled");
    $('#' + this.joueurEnCours.position.id).addClass("surlignage");
  }

  fuiteJoueur() {
    // Si le joueur attaqué décide de fuir au lieu de combattre.
    $(".attaquer").prop("disabled", "true")
    $('.attaquer').removeAttr("style");
    $(".defendre").prop("disabled", "true")
    $('.defendre').removeAttr("style");
  }

  finPartie() {
    // On lance la fin de partie si un joueur décède.

    // Initialisation du son de mort.
    let sonMort = document.createElement("audio");
    sonMort.src = "sons/mort.mp3";
    sonMort.volume = 0.1;
    sonMort.autoPlay = false;
    sonMort.preLoad = true;
    sonMort.controls = true;

    if (this.ennemiEnCours.sante <= 0) { // Si l'ennemi n'a plus de point de vie.
      this.victoire = true; // Victoire !
      $('#game-over').modal('show'); // On fait apparaître l'écran de fin de partie.
      sonMort.play(); // Son de mort.
      $('#vainqueur').append(this.joueurEnCours.nom);
      setTimeout(function() { // On relance le jeu à la fin du son.
        location.reload();
      }, 6000);
    }
  }


  gestionTour() {
    // À chaque tour, lancement des fonctions nécessaires.
    this.finPartie();
    this.definirTour();
    this.plateauPartie.insertionHTML();
    if (!this.combat) { // En case de combat, le surlignage n'a pas lieu.
      this.casesASurligner();
    }
    this.plateauPartie.surlignerCases();
    if (this.proximiteJoueur()) { // Si ça return "true"
      this.gestionProximite(); // On lance gestionProximite pour activer les boutons de combat.
      if (!this.combat) { // Si ça ne se bat pas
        this.mouvementJoueur(); // On permet la fuite en lançant la gestion des mouvements.
      }
    } else {
      this.mouvementJoueur();
      this.fuiteJoueur();
    }
  }

  lancerPartie() {
    // Initialisation d'une partie avec toutes les fonctions nécessaires.

    this.plateauPartie.genererPlateau();

    this.plateauPartie.casesVides();

    this.plateauPartie.placementJoueurs();

    this.plateauPartie.placementArmes();

    this.plateauPartie.insertionHTML();

    this.casesASurligner();

    this.plateauPartie.surlignerCases();

    this.mouvementJoueur();

    this.gestionBoutons();

  }
}

// Création des armes du jeu.
const arme1 = new Arme(1, "Dague", 10, '<img src="icones/arme1.png" alt="Dague" class="img-fluid" width="25%">');
const arme2 = new Arme(2, "Épée de crystal", 20, '<img src="icones/arme2.png" alt="Épée" class="img-fluid" width="25%">');
const arme3 = new Arme(3, "Double épées", 30, '<img src="icones/arme3.png" alt="Double épées" class="img-fluid" width="25%">');
const arme4 = new Arme(4, "Hache", 40, '<img src="icones/arme4.png" alt="Hache" class="img-fluid" width="25%">');
const arme5 = new Arme(5, "Hallebarde géante", 50, '<img src="icones/arme5.png" alt="Hallebarde" class="img-fluid" width="25%">');

// Création des deux joueurs.
var joueur1 = new Joueur("Joueur 1", 100, arme1, '<img src="icones/joueur1.png" alt="Joueur 1" class="img-fluid">');
var joueur2 = new Joueur("Joueur 2", 100, arme1, '<img src="icones/joueur2.png" alt="Joueur 2" class="img-fluid">');
