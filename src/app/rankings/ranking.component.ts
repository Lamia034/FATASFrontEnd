import { Component } from '@angular/core';
import Swal from "sweetalert2";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Fish} from "../fishes/fish";
import {Competition} from "../competitions/competition";
import {CompetitionService} from "../competitions/competition.service";
import {MemberService} from "../members/member.service";
import {RankingService} from "./ranking.service";
import {HuntingService} from "../huntings/hunting.service";
import {FishService} from "../fishes/fish.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-rankings',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent {


}
