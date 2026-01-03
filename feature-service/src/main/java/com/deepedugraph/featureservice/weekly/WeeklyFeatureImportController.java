package com.deepedugraph.featureservice.weekly;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@RestController
@RequestMapping("/weekly-features")
public class WeeklyFeatureImportController {

    private final WeeklyFeatureService weeklyFeatureService;

    public WeeklyFeatureImportController(WeeklyFeatureService weeklyFeatureService) {
        this.weeklyFeatureService = weeklyFeatureService;
    }

    @PostMapping("/import")
    public ResponseEntity<String> importCsv(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Veuillez sélectionner un fichier CSV à importer.");
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            int lineNumber = 0;
            reader.readLine();

            while ((line = reader.readLine()) != null) {
                lineNumber++;
                String[] data = line.split(",");
                if (data.length == 8) {
                    try {
                        Long studentId = Long.parseLong(data[0].trim());
                        Long courseId = Long.parseLong(data[1].trim());
                        Integer week = Integer.parseInt(data[2].trim());
                        Integer totalEvents = Integer.parseInt(data[3].trim());
                        Integer logins = Integer.parseInt(data[4].trim());
                        Integer resourceViews = Integer.parseInt(data[5].trim());
                        Integer submissions = Integer.parseInt(data[6].trim());
                        Integer label = Integer.parseInt(data[7].trim());

                        weeklyFeatureService.saveRaw(studentId, courseId, week, totalEvents, logins, resourceViews, submissions, label);
                    } catch (NumberFormatException e) {
                        System.err.println("Erreur de format numérique à la ligne " + lineNumber + ": " + line);
                    }
                } else {
                    System.err.println("Ligne ignorée (format incorrect) à la ligne " + lineNumber + ": " + line);
                }
            }
            return ResponseEntity.ok("Import CSV terminé avec succès. " + (lineNumber - 1) + " lignes traitées.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de l'import du fichier CSV: " + e.getMessage());
        }
    }
}
