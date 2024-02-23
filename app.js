$(function () {
  let raceInProgress = false;
  $("#resetRace").prop("disabled", true);

  $("#startRace").click(function () {
    if (!raceInProgress) {
      raceInProgress = true;
      disableButtons();
      startCountdown();
    }
  });

  $("#resetRace").click(function () {
    if (!raceInProgress) {
      resetRace();
    }
  });

  function disableButtons() {
    $("#startRace, #resetRace").prop("disabled", true);
  }

  function startCountdown() {
    let countdown = 3;
    const countdownElement = $("#countdown");

    countdownElement.text(countdown).show();

    const countdownInterval = setInterval(function () {
      countdown--;
      countdownElement.text(countdown);

      if (countdown <= 0) {
        clearInterval(countdownInterval);
        countdownElement.hide();
        startRace();
      }
    }, 1000);
  }

  function startRace() {
    const carWidth = $("#car1").width();
    const racetrackWidth = $(window).width() - carWidth;

    const car1Time = Math.floor(Math.random() * 5000 + 1);
    const car2Time = Math.floor(Math.random() * 5000 + 1);

    $("#car1").animate({ left: racetrackWidth }, car1Time);
    $("#car2").animate({ left: racetrackWidth }, car2Time, function () {
      raceInProgress = false;
      $("#startRace").prop("disabled", false);
      $("#resetRace").prop("disabled", true);
      const car1Place = car1Time < car2Time ? "first" : "second";
      const car2Place = car1Time < car2Time ? "second" : "first";

      $("#car1-results").prepend(
        `<tr><td>Finished in: <span class="white">${car1Place}</span> place with a time of: <span class="white">${car1Time}</span> milliseconds!</td></tr>`
      );
      $("#car2-results").prepend(
        `<tr><td>Finished in: <span class="red">${car2Place}</span> place with a time of: <span class="red">${car2Time}</span> milliseconds!</td></tr>`
      );

      showFinishFlag();

      savePreviousResults(car1Place, car1Time, car2Place, car2Time);
    });
  }

  function resetRace() {
    const racetrack = $("#race-track");
    racetrack.removeClass("race-started");
    $("#car1").css("left", "0");
    $("#car2").css("left", "0");
    $(".finish-img").css("display", "none");
    $(".background").css("display", "none");
    $("#startRace").prop("disabled", false);
    $("#resetRace").prop("disabled", true);
  }

  function showFinishFlag() {
    $(".finish-img").css("display", "block");
    $(".background").css("display", "block");
    $("#resetRace").prop("disabled", false);
    $("#startRace").prop("disabled", true);
  }

  function savePreviousResults(car1Place, car1Time, car2Place, car2Time) {
    const previousResults =
      JSON.parse(localStorage.getItem("previousResults")) || [];

    previousResults.push({
      car1Place: car1Place,
      car1Time: car1Time,
      car2Place: car2Place,
      car2Time: car2Time,
    });

    localStorage.setItem("previousResults", JSON.stringify(previousResults));
  }

  function updatePreviousResultsTable() {
    const previousResults =
      JSON.parse(localStorage.getItem("previousResults")) || [];
    const previousResultsCol = $(".previous-results");

    previousResultsCol.empty();

    if (previousResults.length > 0) {
      const lastResult = previousResults[previousResults.length - 1];
      previousResultsCol.append(`
      <h3 class="mt-2 mb-5">Last results from the previous time you played this game:</h3>
      <table class="w-100">
        <tbody>
          <tr><td>Car 1 Finished in: <span class="white">${lastResult.car1Place}</span> place with a time of: <span class="white">${lastResult.car1Time}</span> milliseconds!</td></tr>
          <tr><td>Car 2 Finished in: <span class="red">${lastResult.car2Place}</span> place with a time of: <span class="red">${lastResult.car2Time}</span> milliseconds!</td></tr>
        </tbody>
      </table>
    `);
    }
  }

  updatePreviousResultsTable();
});
