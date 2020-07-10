'use strict';

/**
 * @doc overview
 * @name index
 * @description
 *
 * # SchoolMan API
 *
 * Select a service from the menu on the left to see common methods for accessing the data
 *
 */
 
/**
 * @ngdoc module
 * @name SchoolMan
 * @description
 *
 * ## A Modern Grading System for Cameroon
 *
 * This module houses all of the code for SchoolMan.
 */

angular.module('SchoolMan', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'slugifier',
  'pouchdb',
  'ui.bootstrap',
  'SchoolMan.ReportCard', 
  'SchoolMan.Finance',
  'SchoolMan.IDCard',
  'SchoolMan.Reports',
  'SchoolMan.Staffing',
  'SchoolMan.TimeTable',
  'SchoolMan.Transcript',
  'SchoolMan.Accounting'

]).config(function ($routeProvider, $controllerProvider, $provide) {

  var TEMPLATE_DIRECTORY = {
    login:    "/views/login2.html",
    login404: "/views/login.html",
    users:    "/views/admin-users.html",
    subjects:  "/views/admin-subjects.html",
    classes:  "/views/admin-classes.html",
    departments:"/views/admin-departments.html",
    classmasterProfile:"/views/classmaster-profile.html",
    classmasterMarksheet:"/extensions/ReportCard/classmaster-marksheet.html",
    teacherMarksheet:"/extensions/ReportCard/teacher-marksheet.html",
    mastersheet:"/extensions/ReportCard/mastersheet.html",
    myclasses:"/extensions/ReportCard/myclasses.html",
    reportcard:"/extensions/ReportCard/reportcard.html",
    classcouncil:"/extensions/ReportCard/classcouncil.html",
    adminStats:"/extensions/ReportCard/admin-stats.html",
    IncomeandExpenditure:"/extensions/Accounting/incomexpend.html",
    rubrics:"/extensions/Accounting/rubrics.html",
    classmasterStats:"/extensions/ReportCard/classmaster-stats.html",
    registrarProfile:"/extensions/Finance/registrar-profile.html",
    fees:"/extensions/Finance/registrar-fees.html",
    balancesheet:"/extensions/Finance/balancesheet.html",
    transcript: "/extensions/Transcript/transcript.html",
    annualreport:"/extensions/Reports/annualreport.html",
    enrollmentreport:"/extensions/Reports/enrollmentreport.html",
    stafflist:"/extensions/Staffing/stafflist.html",
    idcardsFull:"/extensions/IDCard/idcards-full.html",
    idcardsSmall:"/extensions/IDCard/idcards-small.html"
  };

  var getTemplate = function(p){
    // var base = '/views/';
    var template = "";
    if(TEMPLATE_DIRECTORY.hasOwnProperty(p.page)){
      template = TEMPLATE_DIRECTORY[p.page];
    } else if(p.hasOwnProperty('page') && p.hasOwnProperty('subpage')){
      template = '/views/' + p.page + '.html';
    } else {
      console.log("404 Page Not Found");
    }
    // var templatePath = base + template;
    console.log("Load Template: ", template , '\n')
    return template;
  };

  $routeProvider
    .when('/:page/:subpage/:lang/:formIndex/:deptId/:groupId/:subjectId/:termIndex/:studentId/:username/:accessCode/:staffId', {
      templateUrl:function(p){ return getTemplate(p);},
      // controller:'MainCtrl'
    })
    // Login Pages
    .when('/:page/:lang/:fullname/:accessCode', {
      templateUrl:function(p){return getTemplate(p);},
      controller:'LoginCtrl'
    })
    .when('/loading', {
      templateUrl:'/views/loading3.html',
      controller:'Loading3Ctrl'
    })
    .otherwise({
      redirectTo: '/loading'
    });

});

chrome.storage.local.get("initialized",function(r){
  if(!r.hasOwnProperty("initialized")){
    chrome.storage.local.set({initialized:false});
  }
});

// const state = { 'page_id': 1, 'user_id': 5 }
// const title = ''
// const url = 'hello-world.html'

// history.pushState(state, title, url)

document.getElementById("close").onclick = function() {
  window.close();
}

