'use strict';

var extensionList = [ {
    name: "Main",
    labelEn:"Registration",
    labelFr:"Inscription",
    access:['admin', 'registrar'],
    icon:"glyphicon-cog",
    tabs: [
      {
        en:"Users",
        fr:"Utilisateurs",
        page:"users",
        access:['admin'],
        exclude:[],
        icon:'glyphicon-lock'
      },
      {
        en:"User Settings",
        fr:"Réglages d'Utilisateurs",
        page:"user",
        access:['classmaster','admin','teacher', 'registrar'],
        exclude:'all',
        icon:'glyphicon-cog'
      },
      {
        en:"Departments",
        fr:"Départements",
        page:"departments",
        access:['admin'],
        exclude:[],
        icon:'glyphicon-bookmark'
      },
      {
        en:"Classes",
        fr:"Classes",
        page:"classes",
        access:['admin'],
        exclude:[],
        icon:'glyphicon-calendar'
      },
      {
        en:"Subjects",
        fr:"Sujets",
        page:"subjects",
        access:['admin'],
        exclude:[],
        icon:'glyphicon-book'
      },
      {
        en:"Students",
        fr:"Étudiants",
        page:"students",
        access:['admin', 'registrar'],
        exclude:[],
        icon:'glyphicon-list-alt'
      },      
      {
        en:"Student Profile",
        fr:"Profil de l'Étudiant",
        page:"profile",
        access:['admin', 'registrar'],
        exclude:"all",
        icon:'glyphicon-user'
      },
      {
        en:"Registration",
        fr:"Inscription",
        page:"registration",
        access:['registrar'],
        exclude:[],
        icon:'glyphicon-calendar'
      }
    ]
  },{
    name:"Finance",
    labelEn:"Finance",
    labelFr:"Finance",
    access:['admin', 'registrar'],
    icon:"glyphicon-envelope",
    tabs: [
      {
        en:"Fee Settings",
        fr:"Écolages",
        page:"fees",
        access:['registrar'],
        exclude:[],
        icon:'glyphicon-cog'
      },
      {
        en:"Balance Sheet",
        fr:"Fiche de Contrôle",
        page:"balancesheet",
        access:['registrar', 'admin'],
        exclude:[],
        icon:'glyphicon-envelope'
      },
      
    ]
  },{
    name:"ReportCard",
    labelEn:"Marks",
    labelFr:"Les Notes",
    access:['admin', 'classmaster', 'teacher'],
    icon:"glyphicon-pencil",  
    tabs: [
      {
        en:"My Classes",
        fr:"Mes Classes",
        page:"myclasses",
        access:['teacher'],
        exclude:[],
        icon:'glyphicon-home'
      },
      {
        en:"Marksheet",
        fr:"Relevé de Notes",
        page:"classmasterMarksheet",
        access:['classmaster'],
        exclude:[],
        icon:'glyphicon-pencil'
      },
      {
        en:"Marksheet",
        fr:"Relevé de Notes",
        page:"teacherMarksheet",
        access:['teacher'],
        exclude:['myclasses'],
        icon:'glyphicon-pencil'
      },
      {
        en:"Mastersheet",
        fr:"Carnet de Notes",
        page:"mastersheet",
        access:['classmaster'],
        exclude:[],
        icon:'glyphicon-th-large'
      },
      {
        en:"Report Card",
        fr:"Bulletin de Notes",
        page:"reportcard",
        access:['classmaster'],
        exclude:[],
        icon:'glyphicon-list-alt'
      },
      {
        en:"Class Council",
        fr:"Conseil de Classe",
        page:"classcouncil",
        access:['classmaster','admin'],
        exclude:[],
        icon:'glyphicon-folder-open'
      },
      {
        en:"Statistics",
        fr:"Statistiques",
        page:"classmasterStats",
        access:['classmaster'],
        exclude:[],
        icon:'glyphicon-stats'
      },
      {
        en:"Statistics",
        fr:"Statistiques",
        page:"adminStats",
        access:['admin'],
        exclude:[],
        icon:'glyphicon-stats'
      },
    ]
  },{
    name:"IDCard",
    labelEn:"ID Cards",
    labelFr:"Cartes d'Identité",
    access:['registrar'],
    icon:"glyphicon-print",
    tabs: [
      {
        en:"ID Cards (Large)",
        fr:"Cartes d'Identité (Grande)",
        page:"idcardsFull",
        access:['registrar'],
        exclude:[],
        icon:'glyphicon-print'
      },
      {
        en:"ID Cards (Small)",
        fr:"Cartes d'Identité (Petite)",
        page:"idcardsSmall",
        access:['registrar'],
        exclude:[],
        icon:'glyphicon-print'
      }
    ]
  },
  {
    name:"Accounting",
    labelEn:"Accounting",
    labelFr:"Compte",
    access:['registrar'],
    icon:"glyphicon-print",
    tabs: [
      {
        
        en:"Income and Expenditures",
        fr:"Revenu et Dépense",
        page:"IncomeandExpenditure",
        access:['registrar','admin'],
        exclude:[],
        icon:'glyphicon-th-list'
      },{
        
        en:"Rubrics",
        fr:"Elément",
        page:"rubrics",
        access:['registrar','admin'],
        exclude:[],
        icon:'glyphicon-pencil'
      }
    ]
  }, 
  {
    name:"Reports",
    labelEn:"Reports",
    labelFr:"Rapports",
    access:['admin'],
    icon:"glyphicon-stats",
    tabs: [
      {
        en:"Annual Report",
        fr:"Rapport Annuel",
        page:"annualreport",
        access:['admin'],
        exclude:[],
        icon:'glyphicon-paperclip'
      },
      {
        en:"Enrollment Report",
        fr:"Rapport d'Inscription",
        page:"enrollmentreport",
        access:['admin'],
        exclude:[],
        icon:'glyphicon-list'
      }
    ]
  },{
    name:"Staffing",
    labelEn:"Staffing",
    labelFr:"Personnel",
    access:['admin', 'registrar'],
    icon:"glyphicon-book",
    tabs: [

        {
         en:"Staff list",
         fr:"Personnel",
         page:"stafflist",
         access:['admin','registrar'],
         exclude:[],
         icon:"glyphicon-book"
       },
      {
        en:"Staff Profile",
        fr:"Profil du Personnel",
        page:"staffProfile",
        access:['admin', 'registrar'],
        exclude:'all',
        icon:"glyphicon-user"
      },
      
    ]
  },{
    name:"Transcript",
    labelEn:"Transcript",
    labelFr:"Profil academique",
    access:['admin'],
    icon:"glyphicon-list-alt",
    tabs: [
      {
        en:"Transcript",
        fr:"Profil academique",
        page:"transcript",
        access:['admin'],
        exclude:[],
        icon:'glyphicon-list-alt'
      }
    ]
  }]

angular.module('SchoolMan')
  .constant('VERSION',{
    mode:"ghs"
  })
  
  .constant('EXTENSIONS', extensionList)

  .constant('PROMOTE_OPTIONS', [
    {name: "automatic",
     icon: "glyphicon glyphicon-cog",
     style:""},
    {name: "promote",
     icon: "glyphicon glyphicon-pencil",
     style:"success"},
    {name: "repeat",
     icon: "glyphicon glyphicon-pencil",
     style:"warning"},
    {name: "withdrawal",
     icon: "glyphicon glyphicon-pencil",
     style:"default"},
    {name: "dismiss",
     icon: "glyphicon glyphicon-pencil",
     style:"danger"}
]);
  

