'use strict';

function MastersheetCtrl($scope, $routeParams, SchoolInfos, Subjects, Students, Marksheets, Departments, Groups, SubjectTypes, Forms, Location, Lang) {
	 
    $scope.termIndex = parseInt($routeParams.termIndex);
    $scope.dict = Lang.getDict();
    $scope.lang = $routeParams.lang ? $routeParams.lang : Lang.defaultLang;
    
    $scope.open = Location.open;

    var data = $scope.data = {};
    $scope.data.marksheets = [];
    $scope.data.subjects = Subjects.getAll();
    $scope.data.summaries = {};
    $scope.data.students = [];
    $scope.data.rankings = {};

    SchoolInfos.get("schoolinfo").then(function(info){
        $scope.data.schoolInfo = info;
        //console.log("school info retrieved", $scope.data.schoolInfo);
    }).catch(function(error){
        console.log("failed to get school info", error);
    });

    $scope.round = Math.round;

    $scope.data.view = 'mastersheet';
    $scope.setGraphView = function(view){
      $scope.data.view = view;
    };

    // Load marksheet and student data
    var params = {
      formIndex:$routeParams.formIndex,
      deptId:$routeParams.deptId,
      groupId:$routeParams.groupId
    };
    console.log("Querying marksheet params: ", params);
    Marksheets.query(params).then(function(marksheets){
      console.log("Got marksheets: ", marksheets);

      // Convert marksheets to a list and store in $scope.data.marksheets
      $scope.data.marksheets = _.map(Object.keys(marksheets), function(marksheetId){
        return marksheets[marksheetId];
      });
      console.log("Data.marksheets", $scope.data.marksheets);


      // Create marksheet summaries 
      $scope.data.summaries = _.map(marksheets , function(marksheet){
        var summary = Marksheets.summarize(marksheet, $scope.termIndex);
        return summary;
      });
      // combine all marksheets
      $scope.data.combinedMarksheet = Marksheets.combine($scope.data.summaries);
      // console.log("combined marksheet", $scope.data.combinedMarksheet);
      
      // get rankings from combined marksheet
      $scope.data.rankings = Marksheets.rank($scope.data.marksheets);

      // Create a list of student from the union of marksheet studentIds
      var studentIds = _.union(_.reduce($scope.data.summaries, function(result, summary){
        return result.concat(Object.keys(summary.table));
      },[]));


      Students.getBatch(studentIds).then(function(students){
        console.log("students", students);
        $scope.data.students = _.map(Object.keys(students), function(studentId){
          return students[studentId];
        });

      // Catch errors
      }).catch(function(error){
        console.log("Failed to find students: ", error);
      });



      // GRAPH VIEW
      //----------------------------------------------------------------------
      
      // General Layout settings
      var margin = {top: 20, right: 40, bottom: 30, left: 40},
      width = 1100 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

      var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1);

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(10, "");

      var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<table>"+
                      "<tr>" +
                        "<td style='text-align:right;'>"+$scope.dict.subject+":</td>"+
                        "<td class='tip-subject'>"+d.name+"</td>"+
                      "</tr>"+
                      "<tr>"+
                        "<td style='text-align:right;'>"+$scope.dict.average+":</td>"+
                        "<td class='tip-average'>"+ d.average.toFixed(2) + "</td>"+
                      "</tr>"+
                    "</table>"
            
          })

      var svg = d3.select(".d3-barchart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.call(tip);

      var data = _.map($scope.data.marksheets, function(marksheet){

        var dataItem = {};
        dataItem.subject = $scope.data.subjects[marksheet.subjectId].code;
        dataItem.name=$scope.lang === 'en' ? $scope.data.subjects[marksheet.subjectId].en : $scope.data.subjects[marksheet.subjectId].fr;
        var summary = Marksheets.summarize(marksheet, $routeParams.termIndex);
        console.log("Summary ok", summary.table);
        var total = _.reduce(summary.table, function(total, value){
          return total + value[0];
        },0);
        var average = total/ Object.keys(summary.table).length
        console.log("Summary", summary.table, average);
        dataItem.average = average;

        return dataItem;
      });

      x.domain(data.map(function(d) { return d.subject; }));
      y.domain([0, 20]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text($scope.dict.class_average);

      svg.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.subject); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.average); })
          .attr("height", function(d) { return height - y(d.average); })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

    })
    .catch(function(error){
      console.log("Failed to find marksheets", error);
    });

}
MastersheetCtrl.$inject = ['$scope', '$routeParams', 'SchoolInfos', 'Subjects', 'Students', 'Marksheets', 'Departments', 'Groups', 'SubjectTypes', 'Forms', 'Location', 'Lang'];
angular.module('SchoolMan.ReportCard').controller('MastersheetCtrl', MastersheetCtrl);