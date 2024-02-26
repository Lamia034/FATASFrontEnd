
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetitionService } from './competition.service';
import Swal from 'sweetalert2';
import {Ranking} from "../rankings/ranking";
import { ReactiveFormsModule } from '@angular/forms';
import {Competition} from "./competition";
import {MemberService} from "../members/member.service";
import {RankingService} from "../rankings/ranking.service";
import {HuntingService} from "../huntings/hunting.service";
import {Fish} from "../fishes/fish";
import {FishService} from "../fishes/fish.service";


@Component({
  selector: 'app-competitions',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.css']
})
export class CompetitionComponent implements OnInit {
  topThreeCompetitors: any[] = [];
  fishes: Fish[] = [];
  selectedFish: any;
  pages: number[] = [];
  currentPage = 0;
  pageSize: number = 6;
  competitions: Competition[] = [];
  competitionDate: Date = new Date();
  isPodiumMode:boolean = false;
  isHuntingMode:boolean  =false;
  huntingForm!:FormGroup;
  isAssignMode:boolean  =false;
  assignForm!:FormGroup;
  isUpdateMode: boolean = false;
  selectedCompetitionId: string = '';
  updateForm!: FormGroup;
  showAddForm = false;
  addForm!: FormGroup;

  constructor(
    private competitionService: CompetitionService,
    private memberService: MemberService,
    private rankingService: RankingService,
    private huntingService: HuntingService,
    private fishService: FishService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchPage(1);
    this.updateForm = this.formBuilder.group({
    //  competitionCode: ['', Validators.required],
      competitionAmount: [ Validators.required, Validators.min(0)],
      competitionDate: [ Validators.required],
      competitionStartTime: [Validators.required],
      competitionEndTime: [Validators.required],
      competitionLocation: ['', Validators.required],
      competitionNBParticipants: [Validators.required]
    });

    this.addForm = this.formBuilder.group({
      amount: new FormControl( Validators.required),
      date: new FormControl( Validators.required),
      startTime: new FormControl( Validators.required),
      endTime: new FormControl( Validators.required),
      location: new FormControl( Validators.required),
      nbParticipants: new FormControl( Validators.required)
    });

    this.assignForm = this.formBuilder.group({
      memberNum: new FormControl( Validators.required)
    });
    this.huntingForm = this.formBuilder.group({
      memberNumber: new FormControl( Validators.required),
      fishNumber:new FormControl( Validators.required),
      fish:new FormControl( Validators.required)
    });
    const isCompetitionsRoute = this.route.snapshot.url[0]?.path === 'competitions';
    if (isCompetitionsRoute) {
      // this.fetchCompetitions();
      this.fetchCompetitions(this.currentPage, this.pageSize);

    }


    this.loadFishes();

  }




  fetchCompetitions(page: number, size: number) {
    this.competitionService.getCompetitions(page, size).subscribe(
      (data: Competition[]) => {
        this.competitions = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching competitions:', error);
      }
    );
  }
  loadFishes() {
    this.fishService.getFishes().subscribe(
      (data: Fish[]) => {
        this.fishes = data;
      },
      (error) => {
        console.error('Error fetching fishes:', error);
      }
    );
  }



  deleteCompetition(competitionId: string) {
    this.competitionService.deleteCompetition(competitionId).subscribe({
      next: () => {
        console.log('Competition deleted successfully');
        window.location.reload();
      },
      error: (error) => {
        console.error('Error deleting competition:', error);
      }
    });
  }


  updateCompetition(competitionId: string) {
    this.isUpdateMode = true;
    this.selectedCompetitionId = competitionId;
    const competition = this.competitions.find(a => a.code === competitionId);
    console.log(competition)
    if (competition) {
      this.updateForm.patchValue({
        competitionAmount: competition.amount,
        competitionDate: competition.date,
        competitionStartTime: competition.startTime,
        competitionEndTime: competition.endTime,
        competitionNBParticipants: competition.numberOfParticipants,
        competitionLocation: competition.location
      });
    }
    console.log(competition);
  }

  cancelUpdate() {
    this.isUpdateMode = false;
    this.selectedCompetitionId = '';
    this.updateForm.reset();
  }

  submitUpdate() {
console.log(this.selectedCompetitionId);
    if (this.selectedCompetitionId !== null && this.selectedCompetitionId !== '' && this.updateForm.valid) {
      console.log("after");
      const CompetitionAmount = this.updateForm.value.competitionAmount;
      const CompetitionDate = this.updateForm.value.competitionDate;
      const CompetitionStartTime = this.updateForm.value.competitionStartTime;
      const CompetitionEndTime = this.updateForm.value.competitionEndTime;
      const CompetitionLocation = this.updateForm.value.competitionLocation;
      const competitionNBParticipants = this.updateForm.value.competitionNBParticipants;
      // const CompetitionStartTime = this.addForm.value.startTime;
      // const CompetitionEndTime = this.addForm.value.endTime;
      console.log(competitionNBParticipants);


      const updatedCompetition = {
        amount: CompetitionAmount,
        date: CompetitionDate,
        startTime:CompetitionStartTime,
        endTime:CompetitionEndTime,
        location:CompetitionLocation,
        numberOfParticipants:competitionNBParticipants

      };
      console.log("here");

      this.competitionService.updateCompetition(this.selectedCompetitionId, updatedCompetition).subscribe(
        (response) => {
          console.log('Competition updated successfully');
          this.cancelUpdate();

        //  this.fetchCompetitions();
          this.fetchCompetitions(this.currentPage, this.pageSize);
          console.log("fetched?");
        },
        (error) => {
          console.error('Error updating competition:', error);
        }
      );
    }
  }




  submitNewCompetition() {
    console.log('Submit new competition method called');
    if (this.addForm.valid) {
      const newAmount = this.addForm.value.amount;
      const Date = this.addForm.value.date;
      const startTime = this.addForm.value.startTime;
      const endTime = this.addForm.value.endTime;
      const location = this.addForm.value.location;
      const nbOfParticipants = this.addForm.value.nbParticipants;
      const code = this.createCompetitionCode(location, Date);

      const addedCompetition = {
        code: code,
        amount: newAmount,
        date: Date,
        startTime: startTime,
        endTime: endTime,
        location: location,
        numberOfParticipants: nbOfParticipants
      };
      console.log(addedCompetition);

      this.competitionService.addCompetition(addedCompetition).subscribe(
        (response) => {
          console.log('Competition created successfully');
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Competition created successfully!'
          });
          this.cancelAdd();
          this.fetchCompetitions(this.currentPage, this.pageSize);
        },
        (error) => {
          console.error('Error creating competition:', error);
          if (error.status === 400 && error.error) {
            let errorMessages = '';

            if (error.error.date) {
              errorMessages += `<strong>Date:</strong> ${error.error.date}<br>`;
            }
            if (error.error.amount) {
              errorMessages += `<strong>Amount:</strong> ${error.error.amount}<br>`;
            }

            Swal.fire({
              icon: 'error',
              title: 'Validation Error',
              html: errorMessages || 'Error adding competition, please try again!'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error adding competition, please try again!'
            });
          }
        }
      );
    }
  }

  cancelAdd() {
    this.addForm.reset();
    this.showAddForm = false;
  }
  createCompetitionCode(location: string, date: string): string {
    const formattedDate = new Date(date);
    const day = ('0' + formattedDate.getDate()).slice(-2);
    const month = ('0' + (formattedDate.getMonth() + 1)).slice(-2);
    const year = formattedDate.getFullYear().toString().slice(-2);
    const locationCode = location.substr(0, 3).toLowerCase();
    const competitionCode = `${locationCode}-${day}-${month}-${year}`;

    return competitionCode;
  }
  private checkAssignRole(): boolean {
    const userRoleString = localStorage.getItem('userRole');
    console.log("Stored user role:", userRoleString);

    if (userRoleString) {
      const userRole = JSON.parse(userRoleString);
      const authorities = userRole.userId.map((entry: { authority: any; }) => entry.authority);

      console.log("User authorities:", authorities);

      if (authorities.includes("MANAGER") || authorities.includes("JURY")) {
        console.log("User has MANAGER or JURY role.");
        return true;
      }
    }

    console.log("User does not have MANAGER or JURY role.");
    return false;
  }


  assignMember(competitionId: string) {
    console.log(this.checkAssignRole());
    if (this.checkAssignRole()) {
      this.selectedCompetitionId = competitionId;
      this.isAssignMode = true;
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You are not allowed to do this.'
      });
    }
  }

  submitAssign() {

    if (this.assignForm.valid) {
      const memberNum = this.assignForm.value.memberNum;

      this.memberService.getMemberById(memberNum).subscribe(
        (member: any) => {
          if (member) {
            const addedRanking = {
              num: memberNum,
              code: this.selectedCompetitionId
            };

            this.rankingService.addRanking(addedRanking).subscribe(
              (rankingResponse: any) => {
                console.log('Ranking Added successfully');
                this.cancelAssign();
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: 'member assigned successfully!'
                });

                // this.fetchCompetitions();
                this.fetchCompetitions(this.currentPage, this.pageSize);

              },
              (rankingError: any) => {
                console.error('Error adding ranking:', rankingError);
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'You cannot assign new participants less than 24 hours before the start of the competition.'
                });
              }
            );
          } else {
            console.log('Member does not exist try to add it');

            // this.router.navigateByUrl('/members');
          }
        },
        (error) => {
          console.error('Error fetching member:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Member does not exist try to add it!'
          });
        }
      );
    }
    }



  onFishSelection(selectedFishName: string) {
    console.log('Fish selected:', selectedFishName);

    this.fishService.getFishById(selectedFishName).subscribe(
      (fishData) => {
        console.log('Fetched fish data:', fishData);
        this.selectedFish = fishData;
        console.log('Average Weight:', this.selectedFish.averageWeight);
      },
      (error) => {
        console.error('Error fetching fish:', error);
      }
    );
  }




  addHunting(competitionId: string) {
    if (this.checkAssignRole()) {
    this.selectedCompetitionId = competitionId;
    this.isHuntingMode = true;
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You are not allowed to do this.'
      });
    }
  }


  submitNewHunting(){
    console.log('Submit new hunting method called');
    if (this.huntingForm.valid) {
      const memberNumber = this.huntingForm.value.memberNumber;
      const fishNumber = this.huntingForm.value.fishNumber;
      const fish = this.huntingForm.value.fish;

      const addedHunting = {
        code:this.selectedCompetitionId,
        num: memberNumber,
        numberOfFish:fishNumber,
        name:fish
      };
      console.log(addedHunting);
      this.huntingService.addHunting(addedHunting).subscribe(
        (response) => {
          console.log('Hunting submitted successfully');
          this.cancelAdd();
          this.huntingForm.reset();
          this.isHuntingMode = false;
          // this.fetchCompetitions();
          // this.fetchCompetitions(this.currentPage, this.pageSize);
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Hunting submitted successfully!'
          });
        },
        (error) => {
          console.error('Error creating hunting:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to submit hunting. Member not participated in this competition!'
          });
        }
      );
    }
  }

  cancelHunting() {
    this.huntingForm.reset();
    this.isHuntingMode = false;
  }




  getCompetitionStatus(competitionDate: Date): string {
    const currentDate = new Date();
    const competitionDateObj = new Date(competitionDate);
// console.log(currentDate);

    currentDate.setHours(0, 0, 0, 0);
    competitionDateObj.setHours(0, 0, 0, 0);

    if (competitionDateObj < currentDate) {
      return 'Passed';
    } else if (competitionDateObj > currentDate) {
      return 'Next';
    } else {
      return 'In Progress';
    }
  }


  seePodium(competition: Competition) {
    this.selectedCompetitionId = competition.code;

    const storedData = localStorage.getItem('userId');
    const userId = storedData ? JSON.parse(storedData).userId : null;

    console.log("user id see podium:", userId);

    let isUserAssigned = false;

    for (let rank of competition.rankings) {
      console.log("Ranking memberNum:", rank.id.memberNum);

      if (rank.id.memberNum === userId) {
        isUserAssigned = true;
        this.isPodiumMode = true;
        this.podium();
        break;
      }
    }

    if (this.checkAssignRole()) {
      isUserAssigned = true;
      this.isPodiumMode = true;
      this.podium();
    }

    if (!isUserAssigned) {
      Swal.fire({
        icon: 'error',
        title: 'Oops you cant see podium...',
        text: 'You are not assigned to this competition!'
      });
    }
  }



  // seePodium(competition: Competition) {
  //   this.selectedCompetitionId = competition.code;
  //
  //   const storedData = localStorage.getItem('userId');
  //   const userId = storedData ? JSON.parse(storedData).userId : null;
  //
  //   console.log("user id see podium:", userId);
  //
  //   let isUserAssigned = false;
  //
  //   for (let rank of competition.rankings) {
  //     console.log("Ranking memberNum:", rank.id.memberNum);
  //
  //     if (rank.id.memberNum == userId || this.checkAssignRole()) {
  //       isUserAssigned = true;
  //       this.isPodiumMode = true;
  //       this.podium();
  //       break;
  //     }
  //   }
  //
  //   if (!isUserAssigned) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Oops you cant see podium...',
  //       text: 'You are not assigned to this competition!'
  //     });
  //   }
  // }


  podium() {

    this.rankingService.getTopThreeCompetitors(this.selectedCompetitionId).subscribe(
      (data: any) => {
        console.log('All competitors:', data);

        this.topThreeCompetitors = data.slice(0, 3);

        console.log('Top three competitors:', this.topThreeCompetitors);
      },
      (error: any) => {
        console.error('Error fetching top three competitors:', error);
      }
    );
  }


  cancelPodium() {
    this.isPodiumMode = false;
  }

  fetchPage(page: number): void {
    this.competitionService.getCompetitions(page, 6).subscribe(
      (competitions: Competition[]) => {
        this.competitions = competitions;
        this.currentPage = page;
        this.generatePageNumbers();
      },
      (error: any) => {
        console.error('Error fetching competitions:', error);

      }
    );
  }

  generatePageNumbers(): void {
    this.pages = Array.from({ length: 10 }, (_, i) => i + 1);
  }

  loadPage(page: number): void {
    this.fetchPage(page - 1);
    this.currentPage = page;

  }




  // assignMember(competitionId: string) {
  //   this.isAssignMode = true;
  //   this.selectedCompetitionId = competitionId;
  //   const competition = this.competitions.find(a => a.code === competitionId);
  //   console.log(competition);
  //
  //   if (this.assignForm.valid) {
  //     const memberNum = this.assignForm.value.memberNum;
  //
  //     const addedRanking = {
  //       num: memberNum,
  //       code: competitionId
  //     };
  //
  //     this.memberService.getMemberById(memberNum).subscribe(
  //       (member: any) => {
  //         if (member) {
  //           this.rankingService.addRanking(addedRanking).subscribe(
  //             (rankingResponse: any) => {
  //               console.log('Ranking Added successfully');
  //               this.cancelAdd();
  //               this.fetchCompetitions();
  //             },
  //             (rankingError: any) => {
  //               console.error('Error adding ranking:', rankingError);
  //               // Handle ranking error - show an error message or perform other actions
  //             }
  //           );
  //         } else {
  //           console.log('Member does not exist or returned null');
  //           // Handle null member - show an error message or perform other actions
  //         }
  //       },
  //       (error) => {
  //         console.error('Error fetching member:', error);
  //         // Handle error - show an error message or perform other actions
  //       }
  //     );
  //   }
  // }











  // assignMember(competitionId: string) {
  //   this.isAssignMode = true;
  //   this.selectedCompetitionId = competitionId;
  //   const competition = this.competitions.find(a => a.code === competitionId);
  //   console.log(competition);
  //
  //   if (this.assignForm.valid) {
  //     const memberNum = this.assignForm.value.memberNum;
  //
  //     this.memberService.getMemberById(memberNum).subscribe(
  //       (member: any) => {
  //         if (member) {
  //           const addedRanking = {
  //             num: memberNum,
  //             code: competitionId
  //           };
  //
  //           this.rankingService.addRanking(addedRanking).subscribe(
  //             (rankingResponse: any) => {
  //               console.log('Ranking Added successfully');
  //               this.cancelAdd();
  //               this.fetchCompetitions();
  //             },
  //             (rankingError: any) => {
  //               console.error('Error adding ranking:', rankingError);
  //               // Handle ranking error - show an error message or perform other actions
  //             }
  //           );
  //         } else {
  //           console.log('Member does not exist or returned null');
  //           // Handle null member - show an error message or perform other actions
  //         }
  //       },
  //       (error) => {
  //         console.error('Error fetching member:', error);
  //         // Handle error - show an error message or perform other actions
  //       }
  //     );
  //   }
  // }


  cancelAssign() {
    this.assignForm.reset();
    this.isAssignMode = false;
  }
  // assignMember(competitionId: string) {
  //
  //   this.isAssignMode = true;
  //   this.selectedCompetitionId = competitionId;
  //   const competition = this.competitions.find(a => a.code === competitionId);
  //   console.log(competition)
  //   if (this.assignForm.valid) {
  //     const memberNum = this.assignForm.value.memberNum;
  //     if (this.memberService.getMemberById(memberNum) != null) {
  //       const addedRanking = {
  //         num: memberNum,
  //         code: competitionId
  //       };
  //       this.rankingService.addRanking(addedRanking).subscribe(
  //         (response) => {
  //           console.log('Member Assigned successfully');
  //           this.cancelAdd();
  //           this.fetchCompetitions();
  //         },
  //         (error) => {
  //           console.error('Error assign competition:', error);
  //         }
  //       );
  //     }
  //   }else{
  //
  //   }
  // }
}
