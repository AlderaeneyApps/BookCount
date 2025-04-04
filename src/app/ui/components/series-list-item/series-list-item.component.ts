import { Component, Input, OnInit } from "@angular/core";
import { Series } from "../../../models";
import { IonicModule } from "@ionic/angular";
import { TranslocoPipe } from "@jsverse/transloco";
import { SeriesStorageService } from "../../../sql-services/series-storage/series-storage.service";
import { RouterLink } from "@angular/router";
import { VolumesStorageService } from "../../../sql-services/volumes-storage/volumes-storage.service";
import { DBSQLiteValues } from "@capacitor-community/sqlite";
import { addIcons } from "ionicons";
import { trashSharp } from "ionicons/icons";

@Component({
  selector: 'app-series-list-item',
  templateUrl: './series-list-item.component.html',
  styleUrls: ['./series-list-item.component.scss'],
  imports: [IonicModule, TranslocoPipe, RouterLink],
})
export class SeriesListItemComponent implements OnInit {
  @Input() series!: Series;

  public volumesCount!: number;

  constructor(
    private seriesStorageService: SeriesStorageService,
    private volumeStorageService: VolumesStorageService,
  ) {
    addIcons({
      trashSharp
    })
  }

  async ngOnInit() {
    try {
      const values: DBSQLiteValues = await this.volumeStorageService.countVolumesRelatedToSeries(this.series.id);
      const {values: count} = values;
      this.volumesCount = count?.[0] ?? 0;
    } catch (e) {
      console.error(e);
      this.volumesCount = 0;
    }
  }

  public async deleteSeries() {
    await this.seriesStorageService.deleteSeriesById(
      this.series.id,
      this.series.collectionId,
    );
  }
}
