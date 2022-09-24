import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Uhr, Uhren, uhrUpdate } from './models/uhr.model';
import { CrawlService } from './services/crawl.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DataSource, SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  public note : string;
  appear:boolean = false;
  public page = 1;
  public pageSize = 10;
  displayedColumnsInterest = ['#','name','description','price','location','note'];
  displayedColumns = ['#','name','description','price','location','note','save'];
  uhrenDataSource :any;
  interestDataSource :any;


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

  showListInterest(){
    this.crawlService.getInterestedUhren().subscribe((result:Uhren)=>{
      console.log(result.uhr_info);
      this.interestDataSource = new MatTableDataSource(result.uhr_info);
      console.log(this.interestDataSource);
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


    valuechange() {
      console.log(this.note);
    }

    updateDB(uhr_link:string,uhr_note:string){
      console.log("here")
      this.crawlService.updateUhrDB({uhr_link,uhr_note});
    }

}