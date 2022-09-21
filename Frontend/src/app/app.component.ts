import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Uhr, Uhren } from './models/uhr.model';
import { CrawlService } from './services/crawl.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DataSource, SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  appear:boolean = false;
  public page = 1;
  public pageSize = 10;
  displayedColumns = ['#','name','description','price','location','select'];
  uhrenDataSource :any;
  selection = new SelectionModel(true, []);

  @ViewChild(MatPaginator) pagintor: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private crawlService:CrawlService,
              private _liveAnnouncer: LiveAnnouncer) {

  }

  ngOnInit(){    
  }

  showList(){
    this.crawlService.getAllUhren().subscribe((result:Uhren)=>{
      this.uhrenDataSource = new MatTableDataSource(result.uhr_info);
      this.uhrenDataSource.paginator = this.pagintor;
      this.uhrenDataSource.sort = this.sort;
      console.log(this.uhrenDataSource);
    })
    
  }

  goToLink(index:number){
    window.open(this.uhrenDataSource.filteredData[index].link);
  }

    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) {
      // This example uses English messages. If your application supports
      // multiple language, you would internationalize these strings.
      // Furthermore, you can customize the message to add additional
      // details about the values being sorted.
      if (sortState.direction) {
        this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      } else {
        this._liveAnnouncer.announce('Sorting cleared');
      }
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.uhrenDataSource.data.length;
      console.log(numRows);
      return numSelected === numRows;
    }
  
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.uhrenDataSource.data.forEach(row => this.selection.select(row));
    }

    saveIntoDB(){
      this.uhrenDataSource.data.forEach((data: Uhr) => {
        this.crawlService.saveUhrIntoDB(data).subscribe();
      });
    }

}