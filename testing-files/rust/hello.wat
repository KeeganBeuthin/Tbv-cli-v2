(module
  (type (;0;) (func (param i32 i32) (result i32)))
  (type (;1;) (func (param i32 i32)))
  (type (;2;) (func (param i32 i32 i32) (result i32)))
  (type (;3;) (func (param i32 i32 i32)))
  (type (;4;) (func (param i32)))
  (type (;5;) (func (param i32 i32 i32 i32) (result i32)))
  (type (;6;) (func (param i32 i32 i32 i32)))
  (type (;7;) (func (param i32) (result i32)))
  (type (;8;) (func (result i32)))
  (type (;9;) (func))
  (type (;10;) (func (param i32 i32 i32 i32 i32 i32)))
  (type (;11;) (func (param i32 i32 i32 i32 i32)))
  (import "wbg" "__wbg_new_abda76e883ba8a5f" (func (;0;) (type 8)))
  (import "wbg" "__wbg_stack_658279fe44541cf6" (func (;1;) (type 1)))
  (import "wbg" "__wbg_error_f851667af71bcfc6" (func (;2;) (type 1)))
  (import "wbg" "__wbindgen_object_drop_ref" (func (;3;) (type 4)))
  (func (;4;) (type 7) (param i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i64)
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  block  ;; label = @8
                    local.get 0
                    i32.const 245
                    i32.ge_u
                    if  ;; label = @9
                      local.get 0
                      i32.const -65587
                      i32.ge_u
                      br_if 5 (;@4;)
                      local.get 0
                      i32.const 11
                      i32.add
                      local.tee 0
                      i32.const -8
                      i32.and
                      local.set 5
                      i32.const 1050380
                      i32.load
                      local.tee 8
                      i32.eqz
                      br_if 4 (;@5;)
                      i32.const 0
                      local.get 5
                      i32.sub
                      local.set 4
                      block (result i32)  ;; label = @10
                        i32.const 0
                        local.get 5
                        i32.const 256
                        i32.lt_u
                        br_if 0 (;@10;)
                        drop
                        i32.const 31
                        local.get 5
                        i32.const 16777215
                        i32.gt_u
                        br_if 0 (;@10;)
                        drop
                        local.get 5
                        i32.const 6
                        local.get 0
                        i32.const 8
                        i32.shr_u
                        i32.clz
                        local.tee 0
                        i32.sub
                        i32.shr_u
                        i32.const 1
                        i32.and
                        local.get 0
                        i32.const 1
                        i32.shl
                        i32.sub
                        i32.const 62
                        i32.add
                      end
                      local.tee 7
                      i32.const 2
                      i32.shl
                      i32.const 1049968
                      i32.add
                      i32.load
                      local.tee 2
                      i32.eqz
                      if  ;; label = @10
                        i32.const 0
                        local.set 0
                        br 2 (;@8;)
                      end
                      i32.const 0
                      local.set 0
                      local.get 5
                      i32.const 25
                      local.get 7
                      i32.const 1
                      i32.shr_u
                      i32.sub
                      i32.const 0
                      local.get 7
                      i32.const 31
                      i32.ne
                      select
                      i32.shl
                      local.set 3
                      loop  ;; label = @10
                        block  ;; label = @11
                          local.get 2
                          i32.load offset=4
                          i32.const -8
                          i32.and
                          local.tee 6
                          local.get 5
                          i32.lt_u
                          br_if 0 (;@11;)
                          local.get 6
                          local.get 5
                          i32.sub
                          local.tee 6
                          local.get 4
                          i32.ge_u
                          br_if 0 (;@11;)
                          local.get 2
                          local.set 1
                          local.get 6
                          local.tee 4
                          br_if 0 (;@11;)
                          i32.const 0
                          local.set 4
                          local.get 2
                          local.set 0
                          br 4 (;@7;)
                        end
                        local.get 2
                        i32.load offset=20
                        local.tee 6
                        local.get 0
                        local.get 6
                        local.get 2
                        local.get 3
                        i32.const 29
                        i32.shr_u
                        i32.const 4
                        i32.and
                        i32.add
                        i32.const 16
                        i32.add
                        i32.load
                        local.tee 2
                        i32.ne
                        select
                        local.get 0
                        local.get 6
                        select
                        local.set 0
                        local.get 3
                        i32.const 1
                        i32.shl
                        local.set 3
                        local.get 2
                        br_if 0 (;@10;)
                      end
                      br 1 (;@8;)
                    end
                    i32.const 1050376
                    i32.load
                    local.tee 2
                    i32.const 16
                    local.get 0
                    i32.const 11
                    i32.add
                    i32.const 504
                    i32.and
                    local.get 0
                    i32.const 11
                    i32.lt_u
                    select
                    local.tee 5
                    i32.const 3
                    i32.shr_u
                    local.tee 0
                    i32.shr_u
                    local.tee 1
                    i32.const 3
                    i32.and
                    if  ;; label = @9
                      block  ;; label = @10
                        local.get 1
                        i32.const -1
                        i32.xor
                        i32.const 1
                        i32.and
                        local.get 0
                        i32.add
                        local.tee 1
                        i32.const 3
                        i32.shl
                        local.tee 0
                        i32.const 1050112
                        i32.add
                        local.tee 3
                        local.get 0
                        i32.const 1050120
                        i32.add
                        i32.load
                        local.tee 0
                        i32.load offset=8
                        local.tee 4
                        i32.ne
                        if  ;; label = @11
                          local.get 4
                          local.get 3
                          i32.store offset=12
                          local.get 3
                          local.get 4
                          i32.store offset=8
                          br 1 (;@10;)
                        end
                        i32.const 1050376
                        local.get 2
                        i32.const -2
                        local.get 1
                        i32.rotl
                        i32.and
                        i32.store
                      end
                      local.get 0
                      local.get 1
                      i32.const 3
                      i32.shl
                      local.tee 1
                      i32.const 3
                      i32.or
                      i32.store offset=4
                      local.get 0
                      local.get 1
                      i32.add
                      local.tee 1
                      local.get 1
                      i32.load offset=4
                      i32.const 1
                      i32.or
                      i32.store offset=4
                      br 8 (;@1;)
                    end
                    local.get 5
                    i32.const 1050384
                    i32.load
                    i32.le_u
                    br_if 3 (;@5;)
                    block  ;; label = @9
                      block  ;; label = @10
                        local.get 1
                        i32.eqz
                        if  ;; label = @11
                          i32.const 1050380
                          i32.load
                          local.tee 0
                          i32.eqz
                          br_if 6 (;@5;)
                          local.get 0
                          i32.ctz
                          i32.const 2
                          i32.shl
                          i32.const 1049968
                          i32.add
                          i32.load
                          local.tee 1
                          i32.load offset=4
                          i32.const -8
                          i32.and
                          local.get 5
                          i32.sub
                          local.set 4
                          local.get 1
                          local.set 2
                          loop  ;; label = @12
                            block  ;; label = @13
                              local.get 1
                              i32.load offset=16
                              local.tee 0
                              br_if 0 (;@13;)
                              local.get 1
                              i32.load offset=20
                              local.tee 0
                              br_if 0 (;@13;)
                              local.get 2
                              i32.load offset=24
                              local.set 7
                              block  ;; label = @14
                                block  ;; label = @15
                                  local.get 2
                                  local.get 2
                                  i32.load offset=12
                                  local.tee 0
                                  i32.eq
                                  if  ;; label = @16
                                    local.get 2
                                    i32.const 20
                                    i32.const 16
                                    local.get 2
                                    i32.load offset=20
                                    local.tee 0
                                    select
                                    i32.add
                                    i32.load
                                    local.tee 1
                                    br_if 1 (;@15;)
                                    i32.const 0
                                    local.set 0
                                    br 2 (;@14;)
                                  end
                                  local.get 2
                                  i32.load offset=8
                                  local.tee 1
                                  local.get 0
                                  i32.store offset=12
                                  local.get 0
                                  local.get 1
                                  i32.store offset=8
                                  br 1 (;@14;)
                                end
                                local.get 2
                                i32.const 20
                                i32.add
                                local.get 2
                                i32.const 16
                                i32.add
                                local.get 0
                                select
                                local.set 3
                                loop  ;; label = @15
                                  local.get 3
                                  local.set 6
                                  local.get 1
                                  local.tee 0
                                  i32.const 20
                                  i32.add
                                  local.get 0
                                  i32.const 16
                                  i32.add
                                  local.get 0
                                  i32.load offset=20
                                  local.tee 1
                                  select
                                  local.set 3
                                  local.get 0
                                  i32.const 20
                                  i32.const 16
                                  local.get 1
                                  select
                                  i32.add
                                  i32.load
                                  local.tee 1
                                  br_if 0 (;@15;)
                                end
                                local.get 6
                                i32.const 0
                                i32.store
                              end
                              local.get 7
                              i32.eqz
                              br_if 4 (;@9;)
                              local.get 2
                              local.get 2
                              i32.load offset=28
                              i32.const 2
                              i32.shl
                              i32.const 1049968
                              i32.add
                              local.tee 1
                              i32.load
                              i32.ne
                              if  ;; label = @14
                                local.get 7
                                i32.const 16
                                i32.const 20
                                local.get 7
                                i32.load offset=16
                                local.get 2
                                i32.eq
                                select
                                i32.add
                                local.get 0
                                i32.store
                                local.get 0
                                i32.eqz
                                br_if 5 (;@9;)
                                br 4 (;@10;)
                              end
                              local.get 1
                              local.get 0
                              i32.store
                              local.get 0
                              br_if 3 (;@10;)
                              i32.const 1050380
                              i32.const 1050380
                              i32.load
                              i32.const -2
                              local.get 2
                              i32.load offset=28
                              i32.rotl
                              i32.and
                              i32.store
                              br 4 (;@9;)
                            end
                            local.get 0
                            i32.load offset=4
                            i32.const -8
                            i32.and
                            local.get 5
                            i32.sub
                            local.tee 1
                            local.get 4
                            local.get 1
                            local.get 4
                            i32.lt_u
                            local.tee 1
                            select
                            local.set 4
                            local.get 0
                            local.get 2
                            local.get 1
                            select
                            local.set 2
                            local.get 0
                            local.set 1
                            br 0 (;@12;)
                          end
                          unreachable
                        end
                        block  ;; label = @11
                          i32.const 2
                          local.get 0
                          i32.shl
                          local.tee 3
                          i32.const 0
                          local.get 3
                          i32.sub
                          i32.or
                          local.get 1
                          local.get 0
                          i32.shl
                          i32.and
                          i32.ctz
                          local.tee 0
                          i32.const 3
                          i32.shl
                          local.tee 1
                          i32.const 1050112
                          i32.add
                          local.tee 3
                          local.get 1
                          i32.const 1050120
                          i32.add
                          i32.load
                          local.tee 1
                          i32.load offset=8
                          local.tee 4
                          i32.ne
                          if  ;; label = @12
                            local.get 4
                            local.get 3
                            i32.store offset=12
                            local.get 3
                            local.get 4
                            i32.store offset=8
                            br 1 (;@11;)
                          end
                          i32.const 1050376
                          local.get 2
                          i32.const -2
                          local.get 0
                          i32.rotl
                          i32.and
                          i32.store
                        end
                        local.get 1
                        local.get 5
                        i32.const 3
                        i32.or
                        i32.store offset=4
                        local.get 1
                        local.get 5
                        i32.add
                        local.tee 6
                        local.get 0
                        i32.const 3
                        i32.shl
                        local.tee 0
                        local.get 5
                        i32.sub
                        local.tee 4
                        i32.const 1
                        i32.or
                        i32.store offset=4
                        local.get 0
                        local.get 1
                        i32.add
                        local.get 4
                        i32.store
                        i32.const 1050384
                        i32.load
                        local.tee 2
                        if  ;; label = @11
                          local.get 2
                          i32.const -8
                          i32.and
                          i32.const 1050112
                          i32.add
                          local.set 0
                          i32.const 1050392
                          i32.load
                          local.set 3
                          block (result i32)  ;; label = @12
                            i32.const 1050376
                            i32.load
                            local.tee 5
                            i32.const 1
                            local.get 2
                            i32.const 3
                            i32.shr_u
                            i32.shl
                            local.tee 2
                            i32.and
                            i32.eqz
                            if  ;; label = @13
                              i32.const 1050376
                              local.get 2
                              local.get 5
                              i32.or
                              i32.store
                              local.get 0
                              br 1 (;@12;)
                            end
                            local.get 0
                            i32.load offset=8
                          end
                          local.set 2
                          local.get 0
                          local.get 3
                          i32.store offset=8
                          local.get 2
                          local.get 3
                          i32.store offset=12
                          local.get 3
                          local.get 0
                          i32.store offset=12
                          local.get 3
                          local.get 2
                          i32.store offset=8
                        end
                        i32.const 1050392
                        local.get 6
                        i32.store
                        i32.const 1050384
                        local.get 4
                        i32.store
                        local.get 1
                        i32.const 8
                        i32.add
                        return
                      end
                      local.get 0
                      local.get 7
                      i32.store offset=24
                      local.get 2
                      i32.load offset=16
                      local.tee 1
                      if  ;; label = @10
                        local.get 0
                        local.get 1
                        i32.store offset=16
                        local.get 1
                        local.get 0
                        i32.store offset=24
                      end
                      local.get 2
                      i32.load offset=20
                      local.tee 1
                      i32.eqz
                      br_if 0 (;@9;)
                      local.get 0
                      local.get 1
                      i32.store offset=20
                      local.get 1
                      local.get 0
                      i32.store offset=24
                    end
                    block  ;; label = @9
                      block  ;; label = @10
                        local.get 4
                        i32.const 16
                        i32.ge_u
                        if  ;; label = @11
                          local.get 2
                          local.get 5
                          i32.const 3
                          i32.or
                          i32.store offset=4
                          local.get 2
                          local.get 5
                          i32.add
                          local.tee 5
                          local.get 4
                          i32.const 1
                          i32.or
                          i32.store offset=4
                          local.get 4
                          local.get 5
                          i32.add
                          local.get 4
                          i32.store
                          i32.const 1050384
                          i32.load
                          local.tee 3
                          i32.eqz
                          br_if 1 (;@10;)
                          local.get 3
                          i32.const -8
                          i32.and
                          i32.const 1050112
                          i32.add
                          local.set 0
                          i32.const 1050392
                          i32.load
                          local.set 1
                          block (result i32)  ;; label = @12
                            i32.const 1050376
                            i32.load
                            local.tee 6
                            i32.const 1
                            local.get 3
                            i32.const 3
                            i32.shr_u
                            i32.shl
                            local.tee 3
                            i32.and
                            i32.eqz
                            if  ;; label = @13
                              i32.const 1050376
                              local.get 3
                              local.get 6
                              i32.or
                              i32.store
                              local.get 0
                              br 1 (;@12;)
                            end
                            local.get 0
                            i32.load offset=8
                          end
                          local.set 3
                          local.get 0
                          local.get 1
                          i32.store offset=8
                          local.get 3
                          local.get 1
                          i32.store offset=12
                          local.get 1
                          local.get 0
                          i32.store offset=12
                          local.get 1
                          local.get 3
                          i32.store offset=8
                          br 1 (;@10;)
                        end
                        local.get 2
                        local.get 4
                        local.get 5
                        i32.add
                        local.tee 0
                        i32.const 3
                        i32.or
                        i32.store offset=4
                        local.get 0
                        local.get 2
                        i32.add
                        local.tee 0
                        local.get 0
                        i32.load offset=4
                        i32.const 1
                        i32.or
                        i32.store offset=4
                        br 1 (;@9;)
                      end
                      i32.const 1050392
                      local.get 5
                      i32.store
                      i32.const 1050384
                      local.get 4
                      i32.store
                    end
                    local.get 2
                    i32.const 8
                    i32.add
                    return
                  end
                  local.get 0
                  local.get 1
                  i32.or
                  i32.eqz
                  if  ;; label = @8
                    i32.const 0
                    local.set 1
                    i32.const 2
                    local.get 7
                    i32.shl
                    local.tee 0
                    i32.const 0
                    local.get 0
                    i32.sub
                    i32.or
                    local.get 8
                    i32.and
                    local.tee 0
                    i32.eqz
                    br_if 3 (;@5;)
                    local.get 0
                    i32.ctz
                    i32.const 2
                    i32.shl
                    i32.const 1049968
                    i32.add
                    i32.load
                    local.set 0
                  end
                  local.get 0
                  i32.eqz
                  br_if 1 (;@6;)
                end
                loop  ;; label = @7
                  local.get 0
                  local.get 1
                  local.get 0
                  i32.load offset=4
                  i32.const -8
                  i32.and
                  local.tee 3
                  local.get 5
                  i32.sub
                  local.tee 6
                  local.get 4
                  i32.lt_u
                  local.tee 7
                  select
                  local.set 8
                  local.get 0
                  i32.load offset=16
                  local.tee 2
                  i32.eqz
                  if  ;; label = @8
                    local.get 0
                    i32.load offset=20
                    local.set 2
                  end
                  local.get 1
                  local.get 8
                  local.get 3
                  local.get 5
                  i32.lt_u
                  local.tee 0
                  select
                  local.set 1
                  local.get 4
                  local.get 6
                  local.get 4
                  local.get 7
                  select
                  local.get 0
                  select
                  local.set 4
                  local.get 2
                  local.tee 0
                  br_if 0 (;@7;)
                end
              end
              local.get 1
              i32.eqz
              br_if 0 (;@5;)
              local.get 5
              i32.const 1050384
              i32.load
              local.tee 0
              i32.le_u
              local.get 4
              local.get 0
              local.get 5
              i32.sub
              i32.ge_u
              i32.and
              br_if 0 (;@5;)
              local.get 1
              i32.load offset=24
              local.set 7
              block  ;; label = @6
                block  ;; label = @7
                  local.get 1
                  local.get 1
                  i32.load offset=12
                  local.tee 0
                  i32.eq
                  if  ;; label = @8
                    local.get 1
                    i32.const 20
                    i32.const 16
                    local.get 1
                    i32.load offset=20
                    local.tee 0
                    select
                    i32.add
                    i32.load
                    local.tee 2
                    br_if 1 (;@7;)
                    i32.const 0
                    local.set 0
                    br 2 (;@6;)
                  end
                  local.get 1
                  i32.load offset=8
                  local.tee 2
                  local.get 0
                  i32.store offset=12
                  local.get 0
                  local.get 2
                  i32.store offset=8
                  br 1 (;@6;)
                end
                local.get 1
                i32.const 20
                i32.add
                local.get 1
                i32.const 16
                i32.add
                local.get 0
                select
                local.set 3
                loop  ;; label = @7
                  local.get 3
                  local.set 6
                  local.get 2
                  local.tee 0
                  i32.const 20
                  i32.add
                  local.get 0
                  i32.const 16
                  i32.add
                  local.get 0
                  i32.load offset=20
                  local.tee 2
                  select
                  local.set 3
                  local.get 0
                  i32.const 20
                  i32.const 16
                  local.get 2
                  select
                  i32.add
                  i32.load
                  local.tee 2
                  br_if 0 (;@7;)
                end
                local.get 6
                i32.const 0
                i32.store
              end
              local.get 7
              i32.eqz
              br_if 3 (;@2;)
              local.get 1
              local.get 1
              i32.load offset=28
              i32.const 2
              i32.shl
              i32.const 1049968
              i32.add
              local.tee 2
              i32.load
              i32.ne
              if  ;; label = @6
                local.get 7
                i32.const 16
                i32.const 20
                local.get 7
                i32.load offset=16
                local.get 1
                i32.eq
                select
                i32.add
                local.get 0
                i32.store
                local.get 0
                i32.eqz
                br_if 4 (;@2;)
                br 3 (;@3;)
              end
              local.get 2
              local.get 0
              i32.store
              local.get 0
              br_if 2 (;@3;)
              i32.const 1050380
              i32.const 1050380
              i32.load
              i32.const -2
              local.get 1
              i32.load offset=28
              i32.rotl
              i32.and
              i32.store
              br 3 (;@2;)
            end
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  block  ;; label = @8
                    block  ;; label = @9
                      local.get 5
                      i32.const 1050384
                      i32.load
                      local.tee 1
                      i32.gt_u
                      if  ;; label = @10
                        local.get 5
                        i32.const 1050388
                        i32.load
                        local.tee 0
                        i32.ge_u
                        if  ;; label = @11
                          i32.const 0
                          local.set 4
                          local.get 5
                          i32.const 65583
                          i32.add
                          local.tee 0
                          i32.const 16
                          i32.shr_u
                          memory.grow
                          local.tee 1
                          i32.const -1
                          i32.eq
                          local.tee 3
                          br_if 7 (;@4;)
                          local.get 1
                          i32.const 16
                          i32.shl
                          local.tee 2
                          i32.eqz
                          br_if 7 (;@4;)
                          i32.const 1050400
                          i32.const 0
                          local.get 0
                          i32.const -65536
                          i32.and
                          local.get 3
                          select
                          local.tee 4
                          i32.const 1050400
                          i32.load
                          i32.add
                          local.tee 0
                          i32.store
                          i32.const 1050404
                          i32.const 1050404
                          i32.load
                          local.tee 1
                          local.get 0
                          local.get 0
                          local.get 1
                          i32.lt_u
                          select
                          i32.store
                          block  ;; label = @12
                            block  ;; label = @13
                              i32.const 1050396
                              i32.load
                              local.tee 3
                              if  ;; label = @14
                                i32.const 1050096
                                local.set 0
                                loop  ;; label = @15
                                  local.get 0
                                  i32.load
                                  local.tee 1
                                  local.get 0
                                  i32.load offset=4
                                  local.tee 6
                                  i32.add
                                  local.get 2
                                  i32.eq
                                  br_if 2 (;@13;)
                                  local.get 0
                                  i32.load offset=8
                                  local.tee 0
                                  br_if 0 (;@15;)
                                end
                                br 2 (;@12;)
                              end
                              i32.const 1050412
                              i32.load
                              local.tee 0
                              i32.const 0
                              local.get 0
                              local.get 2
                              i32.le_u
                              select
                              i32.eqz
                              if  ;; label = @14
                                i32.const 1050412
                                local.get 2
                                i32.store
                              end
                              i32.const 1050416
                              i32.const 4095
                              i32.store
                              i32.const 1050100
                              local.get 4
                              i32.store
                              i32.const 1050096
                              local.get 2
                              i32.store
                              i32.const 1050124
                              i32.const 1050112
                              i32.store
                              i32.const 1050132
                              i32.const 1050120
                              i32.store
                              i32.const 1050120
                              i32.const 1050112
                              i32.store
                              i32.const 1050140
                              i32.const 1050128
                              i32.store
                              i32.const 1050128
                              i32.const 1050120
                              i32.store
                              i32.const 1050148
                              i32.const 1050136
                              i32.store
                              i32.const 1050136
                              i32.const 1050128
                              i32.store
                              i32.const 1050156
                              i32.const 1050144
                              i32.store
                              i32.const 1050144
                              i32.const 1050136
                              i32.store
                              i32.const 1050164
                              i32.const 1050152
                              i32.store
                              i32.const 1050152
                              i32.const 1050144
                              i32.store
                              i32.const 1050172
                              i32.const 1050160
                              i32.store
                              i32.const 1050160
                              i32.const 1050152
                              i32.store
                              i32.const 1050180
                              i32.const 1050168
                              i32.store
                              i32.const 1050168
                              i32.const 1050160
                              i32.store
                              i32.const 1050108
                              i32.const 0
                              i32.store
                              i32.const 1050188
                              i32.const 1050176
                              i32.store
                              i32.const 1050176
                              i32.const 1050168
                              i32.store
                              i32.const 1050184
                              i32.const 1050176
                              i32.store
                              i32.const 1050196
                              i32.const 1050184
                              i32.store
                              i32.const 1050192
                              i32.const 1050184
                              i32.store
                              i32.const 1050204
                              i32.const 1050192
                              i32.store
                              i32.const 1050200
                              i32.const 1050192
                              i32.store
                              i32.const 1050212
                              i32.const 1050200
                              i32.store
                              i32.const 1050208
                              i32.const 1050200
                              i32.store
                              i32.const 1050220
                              i32.const 1050208
                              i32.store
                              i32.const 1050216
                              i32.const 1050208
                              i32.store
                              i32.const 1050228
                              i32.const 1050216
                              i32.store
                              i32.const 1050224
                              i32.const 1050216
                              i32.store
                              i32.const 1050236
                              i32.const 1050224
                              i32.store
                              i32.const 1050232
                              i32.const 1050224
                              i32.store
                              i32.const 1050244
                              i32.const 1050232
                              i32.store
                              i32.const 1050240
                              i32.const 1050232
                              i32.store
                              i32.const 1050252
                              i32.const 1050240
                              i32.store
                              i32.const 1050260
                              i32.const 1050248
                              i32.store
                              i32.const 1050248
                              i32.const 1050240
                              i32.store
                              i32.const 1050268
                              i32.const 1050256
                              i32.store
                              i32.const 1050256
                              i32.const 1050248
                              i32.store
                              i32.const 1050276
                              i32.const 1050264
                              i32.store
                              i32.const 1050264
                              i32.const 1050256
                              i32.store
                              i32.const 1050284
                              i32.const 1050272
                              i32.store
                              i32.const 1050272
                              i32.const 1050264
                              i32.store
                              i32.const 1050292
                              i32.const 1050280
                              i32.store
                              i32.const 1050280
                              i32.const 1050272
                              i32.store
                              i32.const 1050300
                              i32.const 1050288
                              i32.store
                              i32.const 1050288
                              i32.const 1050280
                              i32.store
                              i32.const 1050308
                              i32.const 1050296
                              i32.store
                              i32.const 1050296
                              i32.const 1050288
                              i32.store
                              i32.const 1050316
                              i32.const 1050304
                              i32.store
                              i32.const 1050304
                              i32.const 1050296
                              i32.store
                              i32.const 1050324
                              i32.const 1050312
                              i32.store
                              i32.const 1050312
                              i32.const 1050304
                              i32.store
                              i32.const 1050332
                              i32.const 1050320
                              i32.store
                              i32.const 1050320
                              i32.const 1050312
                              i32.store
                              i32.const 1050340
                              i32.const 1050328
                              i32.store
                              i32.const 1050328
                              i32.const 1050320
                              i32.store
                              i32.const 1050348
                              i32.const 1050336
                              i32.store
                              i32.const 1050336
                              i32.const 1050328
                              i32.store
                              i32.const 1050356
                              i32.const 1050344
                              i32.store
                              i32.const 1050344
                              i32.const 1050336
                              i32.store
                              i32.const 1050364
                              i32.const 1050352
                              i32.store
                              i32.const 1050352
                              i32.const 1050344
                              i32.store
                              i32.const 1050372
                              i32.const 1050360
                              i32.store
                              i32.const 1050360
                              i32.const 1050352
                              i32.store
                              i32.const 1050396
                              local.get 2
                              i32.store
                              i32.const 1050368
                              i32.const 1050360
                              i32.store
                              i32.const 1050388
                              local.get 4
                              i32.const 40
                              i32.sub
                              local.tee 0
                              i32.store
                              local.get 2
                              local.get 0
                              i32.const 1
                              i32.or
                              i32.store offset=4
                              local.get 0
                              local.get 2
                              i32.add
                              i32.const 40
                              i32.store offset=4
                              i32.const 1050408
                              i32.const 2097152
                              i32.store
                              br 8 (;@5;)
                            end
                            local.get 2
                            local.get 3
                            i32.le_u
                            local.get 1
                            local.get 3
                            i32.gt_u
                            i32.or
                            br_if 0 (;@12;)
                            local.get 0
                            i32.load offset=12
                            i32.eqz
                            br_if 3 (;@9;)
                          end
                          i32.const 1050412
                          i32.const 1050412
                          i32.load
                          local.tee 0
                          local.get 2
                          local.get 0
                          local.get 2
                          i32.lt_u
                          select
                          i32.store
                          local.get 2
                          local.get 4
                          i32.add
                          local.set 1
                          i32.const 1050096
                          local.set 0
                          block  ;; label = @12
                            block  ;; label = @13
                              loop  ;; label = @14
                                local.get 1
                                local.get 0
                                i32.load
                                i32.ne
                                if  ;; label = @15
                                  local.get 0
                                  i32.load offset=8
                                  local.tee 0
                                  br_if 1 (;@14;)
                                  br 2 (;@13;)
                                end
                              end
                              local.get 0
                              i32.load offset=12
                              i32.eqz
                              br_if 1 (;@12;)
                            end
                            i32.const 1050096
                            local.set 0
                            loop  ;; label = @13
                              block  ;; label = @14
                                local.get 3
                                local.get 0
                                i32.load
                                local.tee 1
                                i32.ge_u
                                if  ;; label = @15
                                  local.get 1
                                  local.get 0
                                  i32.load offset=4
                                  i32.add
                                  local.tee 6
                                  local.get 3
                                  i32.gt_u
                                  br_if 1 (;@14;)
                                end
                                local.get 0
                                i32.load offset=8
                                local.set 0
                                br 1 (;@13;)
                              end
                            end
                            i32.const 1050396
                            local.get 2
                            i32.store
                            i32.const 1050388
                            local.get 4
                            i32.const 40
                            i32.sub
                            local.tee 0
                            i32.store
                            local.get 2
                            local.get 0
                            i32.const 1
                            i32.or
                            i32.store offset=4
                            local.get 0
                            local.get 2
                            i32.add
                            i32.const 40
                            i32.store offset=4
                            i32.const 1050408
                            i32.const 2097152
                            i32.store
                            local.get 3
                            local.get 6
                            i32.const 32
                            i32.sub
                            i32.const -8
                            i32.and
                            i32.const 8
                            i32.sub
                            local.tee 0
                            local.get 0
                            local.get 3
                            i32.const 16
                            i32.add
                            i32.lt_u
                            select
                            local.tee 1
                            i32.const 27
                            i32.store offset=4
                            i32.const 1050096
                            i64.load align=4
                            local.set 9
                            local.get 1
                            i32.const 16
                            i32.add
                            i32.const 1050104
                            i64.load align=4
                            i64.store align=4
                            local.get 1
                            local.get 9
                            i64.store offset=8 align=4
                            i32.const 1050100
                            local.get 4
                            i32.store
                            i32.const 1050096
                            local.get 2
                            i32.store
                            i32.const 1050104
                            local.get 1
                            i32.const 8
                            i32.add
                            i32.store
                            i32.const 1050108
                            i32.const 0
                            i32.store
                            local.get 1
                            i32.const 28
                            i32.add
                            local.set 0
                            loop  ;; label = @13
                              local.get 0
                              i32.const 7
                              i32.store
                              local.get 0
                              i32.const 4
                              i32.add
                              local.tee 0
                              local.get 6
                              i32.lt_u
                              br_if 0 (;@13;)
                            end
                            local.get 1
                            local.get 3
                            i32.eq
                            br_if 7 (;@5;)
                            local.get 1
                            local.get 1
                            i32.load offset=4
                            i32.const -2
                            i32.and
                            i32.store offset=4
                            local.get 3
                            local.get 1
                            local.get 3
                            i32.sub
                            local.tee 0
                            i32.const 1
                            i32.or
                            i32.store offset=4
                            local.get 1
                            local.get 0
                            i32.store
                            local.get 0
                            i32.const 256
                            i32.ge_u
                            if  ;; label = @13
                              local.get 3
                              local.get 0
                              call 15
                              br 8 (;@5;)
                            end
                            local.get 0
                            i32.const -8
                            i32.and
                            i32.const 1050112
                            i32.add
                            local.set 1
                            block (result i32)  ;; label = @13
                              i32.const 1050376
                              i32.load
                              local.tee 2
                              i32.const 1
                              local.get 0
                              i32.const 3
                              i32.shr_u
                              i32.shl
                              local.tee 0
                              i32.and
                              i32.eqz
                              if  ;; label = @14
                                i32.const 1050376
                                local.get 0
                                local.get 2
                                i32.or
                                i32.store
                                local.get 1
                                br 1 (;@13;)
                              end
                              local.get 1
                              i32.load offset=8
                            end
                            local.set 0
                            local.get 1
                            local.get 3
                            i32.store offset=8
                            local.get 0
                            local.get 3
                            i32.store offset=12
                            local.get 3
                            local.get 1
                            i32.store offset=12
                            local.get 3
                            local.get 0
                            i32.store offset=8
                            br 7 (;@5;)
                          end
                          local.get 0
                          local.get 2
                          i32.store
                          local.get 0
                          local.get 0
                          i32.load offset=4
                          local.get 4
                          i32.add
                          i32.store offset=4
                          local.get 2
                          local.get 5
                          i32.const 3
                          i32.or
                          i32.store offset=4
                          local.get 1
                          local.get 2
                          local.get 5
                          i32.add
                          local.tee 3
                          i32.sub
                          local.set 5
                          local.get 1
                          i32.const 1050396
                          i32.load
                          i32.eq
                          br_if 3 (;@8;)
                          local.get 1
                          i32.const 1050392
                          i32.load
                          i32.eq
                          br_if 4 (;@7;)
                          local.get 1
                          i32.load offset=4
                          local.tee 4
                          i32.const 3
                          i32.and
                          i32.const 1
                          i32.eq
                          if  ;; label = @12
                            local.get 1
                            local.get 4
                            i32.const -8
                            i32.and
                            local.tee 0
                            call 11
                            local.get 0
                            local.get 5
                            i32.add
                            local.set 5
                            local.get 0
                            local.get 1
                            i32.add
                            local.tee 1
                            i32.load offset=4
                            local.set 4
                          end
                          local.get 1
                          local.get 4
                          i32.const -2
                          i32.and
                          i32.store offset=4
                          local.get 3
                          local.get 5
                          i32.const 1
                          i32.or
                          i32.store offset=4
                          local.get 3
                          local.get 5
                          i32.add
                          local.get 5
                          i32.store
                          local.get 5
                          i32.const 256
                          i32.ge_u
                          if  ;; label = @12
                            local.get 3
                            local.get 5
                            call 15
                            br 6 (;@6;)
                          end
                          local.get 5
                          i32.const -8
                          i32.and
                          i32.const 1050112
                          i32.add
                          local.set 0
                          block (result i32)  ;; label = @12
                            i32.const 1050376
                            i32.load
                            local.tee 1
                            i32.const 1
                            local.get 5
                            i32.const 3
                            i32.shr_u
                            i32.shl
                            local.tee 4
                            i32.and
                            i32.eqz
                            if  ;; label = @13
                              i32.const 1050376
                              local.get 1
                              local.get 4
                              i32.or
                              i32.store
                              local.get 0
                              br 1 (;@12;)
                            end
                            local.get 0
                            i32.load offset=8
                          end
                          local.set 5
                          local.get 0
                          local.get 3
                          i32.store offset=8
                          local.get 5
                          local.get 3
                          i32.store offset=12
                          local.get 3
                          local.get 0
                          i32.store offset=12
                          local.get 3
                          local.get 5
                          i32.store offset=8
                          br 5 (;@6;)
                        end
                        i32.const 1050388
                        local.get 0
                        local.get 5
                        i32.sub
                        local.tee 1
                        i32.store
                        i32.const 1050396
                        i32.const 1050396
                        i32.load
                        local.tee 0
                        local.get 5
                        i32.add
                        local.tee 2
                        i32.store
                        local.get 2
                        local.get 1
                        i32.const 1
                        i32.or
                        i32.store offset=4
                        local.get 0
                        local.get 5
                        i32.const 3
                        i32.or
                        i32.store offset=4
                        local.get 0
                        i32.const 8
                        i32.add
                        local.set 4
                        br 6 (;@4;)
                      end
                      i32.const 1050392
                      i32.load
                      local.set 0
                      block  ;; label = @10
                        local.get 1
                        local.get 5
                        i32.sub
                        local.tee 2
                        i32.const 15
                        i32.le_u
                        if  ;; label = @11
                          i32.const 1050392
                          i32.const 0
                          i32.store
                          i32.const 1050384
                          i32.const 0
                          i32.store
                          local.get 0
                          local.get 1
                          i32.const 3
                          i32.or
                          i32.store offset=4
                          local.get 0
                          local.get 1
                          i32.add
                          local.tee 1
                          local.get 1
                          i32.load offset=4
                          i32.const 1
                          i32.or
                          i32.store offset=4
                          br 1 (;@10;)
                        end
                        i32.const 1050384
                        local.get 2
                        i32.store
                        i32.const 1050392
                        local.get 0
                        local.get 5
                        i32.add
                        local.tee 3
                        i32.store
                        local.get 3
                        local.get 2
                        i32.const 1
                        i32.or
                        i32.store offset=4
                        local.get 0
                        local.get 1
                        i32.add
                        local.get 2
                        i32.store
                        local.get 0
                        local.get 5
                        i32.const 3
                        i32.or
                        i32.store offset=4
                      end
                      br 8 (;@1;)
                    end
                    local.get 0
                    local.get 4
                    local.get 6
                    i32.add
                    i32.store offset=4
                    i32.const 1050396
                    i32.const 1050396
                    i32.load
                    local.tee 0
                    i32.const 15
                    i32.add
                    i32.const -8
                    i32.and
                    local.tee 1
                    i32.const 8
                    i32.sub
                    local.tee 2
                    i32.store
                    i32.const 1050388
                    i32.const 1050388
                    i32.load
                    local.get 4
                    i32.add
                    local.tee 3
                    local.get 0
                    local.get 1
                    i32.sub
                    i32.add
                    i32.const 8
                    i32.add
                    local.tee 1
                    i32.store
                    local.get 2
                    local.get 1
                    i32.const 1
                    i32.or
                    i32.store offset=4
                    local.get 0
                    local.get 3
                    i32.add
                    i32.const 40
                    i32.store offset=4
                    i32.const 1050408
                    i32.const 2097152
                    i32.store
                    br 3 (;@5;)
                  end
                  i32.const 1050396
                  local.get 3
                  i32.store
                  i32.const 1050388
                  i32.const 1050388
                  i32.load
                  local.get 5
                  i32.add
                  local.tee 0
                  i32.store
                  local.get 3
                  local.get 0
                  i32.const 1
                  i32.or
                  i32.store offset=4
                  br 1 (;@6;)
                end
                i32.const 1050392
                local.get 3
                i32.store
                i32.const 1050384
                i32.const 1050384
                i32.load
                local.get 5
                i32.add
                local.tee 0
                i32.store
                local.get 3
                local.get 0
                i32.const 1
                i32.or
                i32.store offset=4
                local.get 0
                local.get 3
                i32.add
                local.get 0
                i32.store
              end
              local.get 2
              i32.const 8
              i32.add
              return
            end
            i32.const 0
            local.set 4
            i32.const 1050388
            i32.load
            local.tee 0
            local.get 5
            i32.le_u
            br_if 0 (;@4;)
            i32.const 1050388
            local.get 0
            local.get 5
            i32.sub
            local.tee 1
            i32.store
            i32.const 1050396
            i32.const 1050396
            i32.load
            local.tee 0
            local.get 5
            i32.add
            local.tee 2
            i32.store
            local.get 2
            local.get 1
            i32.const 1
            i32.or
            i32.store offset=4
            local.get 0
            local.get 5
            i32.const 3
            i32.or
            i32.store offset=4
            br 3 (;@1;)
          end
          local.get 4
          return
        end
        local.get 0
        local.get 7
        i32.store offset=24
        local.get 1
        i32.load offset=16
        local.tee 2
        if  ;; label = @3
          local.get 0
          local.get 2
          i32.store offset=16
          local.get 2
          local.get 0
          i32.store offset=24
        end
        local.get 1
        i32.load offset=20
        local.tee 2
        i32.eqz
        br_if 0 (;@2;)
        local.get 0
        local.get 2
        i32.store offset=20
        local.get 2
        local.get 0
        i32.store offset=24
      end
      block  ;; label = @2
        local.get 4
        i32.const 16
        i32.ge_u
        if  ;; label = @3
          local.get 1
          local.get 5
          i32.const 3
          i32.or
          i32.store offset=4
          local.get 1
          local.get 5
          i32.add
          local.tee 2
          local.get 4
          i32.const 1
          i32.or
          i32.store offset=4
          local.get 2
          local.get 4
          i32.add
          local.get 4
          i32.store
          local.get 4
          i32.const 256
          i32.ge_u
          if  ;; label = @4
            local.get 2
            local.get 4
            call 15
            br 2 (;@2;)
          end
          local.get 4
          i32.const -8
          i32.and
          i32.const 1050112
          i32.add
          local.set 0
          block (result i32)  ;; label = @4
            i32.const 1050376
            i32.load
            local.tee 3
            i32.const 1
            local.get 4
            i32.const 3
            i32.shr_u
            i32.shl
            local.tee 4
            i32.and
            i32.eqz
            if  ;; label = @5
              i32.const 1050376
              local.get 3
              local.get 4
              i32.or
              i32.store
              local.get 0
              br 1 (;@4;)
            end
            local.get 0
            i32.load offset=8
          end
          local.set 4
          local.get 0
          local.get 2
          i32.store offset=8
          local.get 4
          local.get 2
          i32.store offset=12
          local.get 2
          local.get 0
          i32.store offset=12
          local.get 2
          local.get 4
          i32.store offset=8
          br 1 (;@2;)
        end
        local.get 1
        local.get 4
        local.get 5
        i32.add
        local.tee 0
        i32.const 3
        i32.or
        i32.store offset=4
        local.get 0
        local.get 1
        i32.add
        local.tee 0
        local.get 0
        i32.load offset=4
        i32.const 1
        i32.or
        i32.store offset=4
      end
      local.get 1
      i32.const 8
      i32.add
      return
    end
    local.get 0
    i32.const 8
    i32.add)
  (func (;5;) (type 5) (param i32 i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32)
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              local.get 0
              i32.const 4
              i32.sub
              local.tee 5
              i32.load
              local.tee 7
              i32.const -8
              i32.and
              local.tee 4
              i32.const 4
              i32.const 8
              local.get 7
              i32.const 3
              i32.and
              local.tee 6
              select
              local.get 1
              i32.add
              i32.ge_u
              if  ;; label = @6
                local.get 6
                i32.const 0
                local.get 1
                i32.const 39
                i32.add
                local.tee 8
                local.get 4
                i32.lt_u
                select
                br_if 1 (;@5;)
                block  ;; label = @7
                  block  ;; label = @8
                    local.get 2
                    i32.const 9
                    i32.ge_u
                    if  ;; label = @9
                      local.get 2
                      local.get 3
                      call 10
                      local.tee 2
                      br_if 1 (;@8;)
                      i32.const 0
                      return
                    end
                    i32.const 0
                    local.set 2
                    local.get 3
                    i32.const -65588
                    i32.gt_u
                    br_if 1 (;@7;)
                    i32.const 16
                    local.get 3
                    i32.const 11
                    i32.add
                    i32.const -8
                    i32.and
                    local.get 3
                    i32.const 11
                    i32.lt_u
                    select
                    local.set 1
                    block  ;; label = @9
                      local.get 6
                      i32.eqz
                      if  ;; label = @10
                        local.get 1
                        i32.const 256
                        i32.lt_u
                        local.get 4
                        local.get 1
                        i32.const 4
                        i32.or
                        i32.lt_u
                        i32.or
                        local.get 4
                        local.get 1
                        i32.sub
                        i32.const 131073
                        i32.ge_u
                        i32.or
                        br_if 1 (;@9;)
                        br 9 (;@1;)
                      end
                      local.get 0
                      i32.const 8
                      i32.sub
                      local.tee 6
                      local.get 4
                      i32.add
                      local.set 8
                      block  ;; label = @10
                        block  ;; label = @11
                          block  ;; label = @12
                            block  ;; label = @13
                              local.get 1
                              local.get 4
                              i32.gt_u
                              if  ;; label = @14
                                local.get 8
                                i32.const 1050396
                                i32.load
                                i32.eq
                                br_if 4 (;@10;)
                                local.get 8
                                i32.const 1050392
                                i32.load
                                i32.eq
                                br_if 2 (;@12;)
                                local.get 8
                                i32.load offset=4
                                local.tee 7
                                i32.const 2
                                i32.and
                                br_if 5 (;@9;)
                                local.get 7
                                i32.const -8
                                i32.and
                                local.tee 7
                                local.get 4
                                i32.add
                                local.tee 4
                                local.get 1
                                i32.lt_u
                                br_if 5 (;@9;)
                                local.get 8
                                local.get 7
                                call 11
                                local.get 4
                                local.get 1
                                i32.sub
                                local.tee 2
                                i32.const 16
                                i32.lt_u
                                br_if 1 (;@13;)
                                local.get 5
                                local.get 1
                                local.get 5
                                i32.load
                                i32.const 1
                                i32.and
                                i32.or
                                i32.const 2
                                i32.or
                                i32.store
                                local.get 1
                                local.get 6
                                i32.add
                                local.tee 1
                                local.get 2
                                i32.const 3
                                i32.or
                                i32.store offset=4
                                local.get 4
                                local.get 6
                                i32.add
                                local.tee 3
                                local.get 3
                                i32.load offset=4
                                i32.const 1
                                i32.or
                                i32.store offset=4
                                local.get 1
                                local.get 2
                                call 9
                                br 13 (;@1;)
                              end
                              local.get 4
                              local.get 1
                              i32.sub
                              local.tee 2
                              i32.const 15
                              i32.gt_u
                              br_if 2 (;@11;)
                              br 12 (;@1;)
                            end
                            local.get 5
                            local.get 4
                            local.get 5
                            i32.load
                            i32.const 1
                            i32.and
                            i32.or
                            i32.const 2
                            i32.or
                            i32.store
                            local.get 4
                            local.get 6
                            i32.add
                            local.tee 1
                            local.get 1
                            i32.load offset=4
                            i32.const 1
                            i32.or
                            i32.store offset=4
                            br 11 (;@1;)
                          end
                          i32.const 1050384
                          i32.load
                          local.get 4
                          i32.add
                          local.tee 4
                          local.get 1
                          i32.lt_u
                          br_if 2 (;@9;)
                          block  ;; label = @12
                            local.get 4
                            local.get 1
                            i32.sub
                            local.tee 3
                            i32.const 15
                            i32.le_u
                            if  ;; label = @13
                              local.get 5
                              local.get 7
                              i32.const 1
                              i32.and
                              local.get 4
                              i32.or
                              i32.const 2
                              i32.or
                              i32.store
                              local.get 4
                              local.get 6
                              i32.add
                              local.tee 1
                              local.get 1
                              i32.load offset=4
                              i32.const 1
                              i32.or
                              i32.store offset=4
                              i32.const 0
                              local.set 3
                              i32.const 0
                              local.set 1
                              br 1 (;@12;)
                            end
                            local.get 5
                            local.get 1
                            local.get 7
                            i32.const 1
                            i32.and
                            i32.or
                            i32.const 2
                            i32.or
                            i32.store
                            local.get 1
                            local.get 6
                            i32.add
                            local.tee 1
                            local.get 3
                            i32.const 1
                            i32.or
                            i32.store offset=4
                            local.get 4
                            local.get 6
                            i32.add
                            local.tee 2
                            local.get 3
                            i32.store
                            local.get 2
                            local.get 2
                            i32.load offset=4
                            i32.const -2
                            i32.and
                            i32.store offset=4
                          end
                          i32.const 1050392
                          local.get 1
                          i32.store
                          i32.const 1050384
                          local.get 3
                          i32.store
                          br 10 (;@1;)
                        end
                        local.get 5
                        local.get 1
                        local.get 7
                        i32.const 1
                        i32.and
                        i32.or
                        i32.const 2
                        i32.or
                        i32.store
                        local.get 1
                        local.get 6
                        i32.add
                        local.tee 1
                        local.get 2
                        i32.const 3
                        i32.or
                        i32.store offset=4
                        local.get 8
                        local.get 8
                        i32.load offset=4
                        i32.const 1
                        i32.or
                        i32.store offset=4
                        local.get 1
                        local.get 2
                        call 9
                        br 9 (;@1;)
                      end
                      i32.const 1050388
                      i32.load
                      local.get 4
                      i32.add
                      local.tee 4
                      local.get 1
                      i32.gt_u
                      br_if 7 (;@2;)
                    end
                    local.get 3
                    call 4
                    local.tee 1
                    i32.eqz
                    br_if 1 (;@7;)
                    local.get 1
                    local.get 0
                    i32.const -4
                    i32.const -8
                    local.get 5
                    i32.load
                    local.tee 1
                    i32.const 3
                    i32.and
                    select
                    local.get 1
                    i32.const -8
                    i32.and
                    i32.add
                    local.tee 1
                    local.get 3
                    local.get 1
                    local.get 3
                    i32.lt_u
                    select
                    call 60
                    local.get 0
                    call 7
                    return
                  end
                  local.get 2
                  local.get 0
                  local.get 1
                  local.get 3
                  local.get 1
                  local.get 3
                  i32.lt_u
                  select
                  call 60
                  drop
                  local.get 5
                  i32.load
                  local.tee 3
                  i32.const -8
                  i32.and
                  local.tee 5
                  local.get 1
                  i32.const 4
                  i32.const 8
                  local.get 3
                  i32.const 3
                  i32.and
                  local.tee 1
                  select
                  i32.add
                  i32.lt_u
                  br_if 3 (;@4;)
                  local.get 1
                  i32.const 0
                  local.get 5
                  local.get 8
                  i32.gt_u
                  select
                  br_if 4 (;@3;)
                  local.get 0
                  call 7
                end
                local.get 2
                return
              end
              i32.const 1049633
              i32.const 46
              i32.const 1049680
              call 33
              unreachable
            end
            i32.const 1049696
            i32.const 46
            i32.const 1049744
            call 33
            unreachable
          end
          i32.const 1049633
          i32.const 46
          i32.const 1049680
          call 33
          unreachable
        end
        i32.const 1049696
        i32.const 46
        i32.const 1049744
        call 33
        unreachable
      end
      local.get 5
      local.get 1
      local.get 7
      i32.const 1
      i32.and
      i32.or
      i32.const 2
      i32.or
      i32.store
      local.get 1
      local.get 6
      i32.add
      local.tee 2
      local.get 4
      local.get 1
      i32.sub
      local.tee 1
      i32.const 1
      i32.or
      i32.store offset=4
      i32.const 1050388
      local.get 1
      i32.store
      i32.const 1050396
      local.get 2
      i32.store
      local.get 0
      return
    end
    local.get 0)
  (func (;6;) (type 0) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i64 i64)
    global.get 0
    i32.const 48
    i32.sub
    local.tee 6
    global.set 0
    i32.const 39
    local.set 2
    block  ;; label = @1
      local.get 0
      i64.load32_u
      local.tee 14
      i64.const 10000
      i64.lt_u
      if  ;; label = @2
        local.get 14
        local.set 15
        br 1 (;@1;)
      end
      loop  ;; label = @2
        local.get 6
        i32.const 9
        i32.add
        local.get 2
        i32.add
        local.tee 0
        i32.const 4
        i32.sub
        local.get 14
        i64.const 10000
        i64.div_u
        local.tee 15
        i64.const 55536
        i64.mul
        local.get 14
        i64.add
        i32.wrap_i64
        local.tee 3
        i32.const 65535
        i32.and
        i32.const 100
        i32.div_u
        local.tee 4
        i32.const 1
        i32.shl
        i32.const 1049368
        i32.add
        i32.load16_u align=1
        i32.store16 align=1
        local.get 0
        i32.const 2
        i32.sub
        local.get 4
        i32.const -100
        i32.mul
        local.get 3
        i32.add
        i32.const 65535
        i32.and
        i32.const 1
        i32.shl
        i32.const 1049368
        i32.add
        i32.load16_u align=1
        i32.store16 align=1
        local.get 2
        i32.const 4
        i32.sub
        local.set 2
        local.get 14
        i64.const 99999999
        i64.gt_u
        local.get 15
        local.set 14
        br_if 0 (;@2;)
      end
    end
    local.get 15
    i32.wrap_i64
    local.tee 0
    i32.const 99
    i32.gt_u
    if  ;; label = @1
      local.get 2
      i32.const 2
      i32.sub
      local.tee 2
      local.get 6
      i32.const 9
      i32.add
      i32.add
      local.get 15
      i32.wrap_i64
      local.tee 3
      i32.const 65535
      i32.and
      i32.const 100
      i32.div_u
      local.tee 0
      i32.const -100
      i32.mul
      local.get 3
      i32.add
      i32.const 65535
      i32.and
      i32.const 1
      i32.shl
      i32.const 1049368
      i32.add
      i32.load16_u align=1
      i32.store16 align=1
    end
    block  ;; label = @1
      local.get 0
      i32.const 10
      i32.ge_u
      if  ;; label = @2
        local.get 2
        i32.const 2
        i32.sub
        local.tee 2
        local.get 6
        i32.const 9
        i32.add
        i32.add
        local.get 0
        i32.const 1
        i32.shl
        i32.const 1049368
        i32.add
        i32.load16_u align=1
        i32.store16 align=1
        br 1 (;@1;)
      end
      local.get 2
      i32.const 1
      i32.sub
      local.tee 2
      local.get 6
      i32.const 9
      i32.add
      i32.add
      local.get 0
      i32.const 48
      i32.or
      i32.store8
    end
    i32.const 39
    local.get 2
    i32.sub
    local.set 4
    i32.const 1
    local.set 3
    i32.const 43
    i32.const 1114112
    local.get 1
    i32.load offset=28
    local.tee 0
    i32.const 1
    i32.and
    local.tee 5
    select
    local.set 8
    local.get 0
    i32.const 4
    i32.and
    i32.const 2
    i32.shr_u
    local.set 9
    local.get 6
    i32.const 9
    i32.add
    local.get 2
    i32.add
    local.set 10
    block  ;; label = @1
      local.get 1
      i32.load
      i32.eqz
      if  ;; label = @2
        local.get 1
        i32.load offset=20
        local.tee 0
        local.get 1
        i32.load offset=24
        local.tee 1
        local.get 8
        local.get 9
        call 34
        br_if 1 (;@1;)
        local.get 0
        local.get 10
        local.get 4
        local.get 1
        i32.load offset=12
        call_indirect (type 2)
        local.set 3
        br 1 (;@1;)
      end
      local.get 1
      i32.load offset=4
      local.tee 7
      local.get 4
      local.get 5
      i32.add
      local.tee 3
      i32.le_u
      if  ;; label = @2
        i32.const 1
        local.set 3
        local.get 1
        i32.load offset=20
        local.tee 0
        local.get 1
        i32.load offset=24
        local.tee 1
        local.get 8
        local.get 9
        call 34
        br_if 1 (;@1;)
        local.get 0
        local.get 10
        local.get 4
        local.get 1
        i32.load offset=12
        call_indirect (type 2)
        local.set 3
        br 1 (;@1;)
      end
      local.get 0
      i32.const 8
      i32.and
      if  ;; label = @2
        local.get 1
        i32.load offset=16
        local.set 12
        local.get 1
        i32.const 48
        i32.store offset=16
        local.get 1
        i32.load8_u offset=32
        local.set 13
        i32.const 1
        local.set 3
        local.get 1
        i32.const 1
        i32.store8 offset=32
        local.get 1
        i32.load offset=20
        local.tee 0
        local.get 1
        i32.load offset=24
        local.tee 11
        local.get 8
        local.get 9
        call 34
        br_if 1 (;@1;)
        local.get 2
        local.get 7
        i32.add
        local.get 5
        i32.sub
        i32.const 38
        i32.sub
        local.set 2
        loop  ;; label = @3
          local.get 2
          i32.const 1
          i32.sub
          local.tee 2
          if  ;; label = @4
            local.get 0
            i32.const 48
            local.get 11
            i32.load offset=16
            call_indirect (type 0)
            i32.eqz
            br_if 1 (;@3;)
            br 3 (;@1;)
          end
        end
        local.get 0
        local.get 10
        local.get 4
        local.get 11
        i32.load offset=12
        call_indirect (type 2)
        br_if 1 (;@1;)
        local.get 1
        local.get 13
        i32.store8 offset=32
        local.get 1
        local.get 12
        i32.store offset=16
        i32.const 0
        local.set 3
        br 1 (;@1;)
      end
      local.get 7
      local.get 3
      i32.sub
      local.set 0
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            local.get 1
            i32.load8_u offset=32
            local.tee 2
            i32.const 1
            i32.sub
            br_table 0 (;@4;) 1 (;@3;) 0 (;@4;) 2 (;@2;)
          end
          local.get 0
          local.set 2
          i32.const 0
          local.set 0
          br 1 (;@2;)
        end
        local.get 0
        i32.const 1
        i32.shr_u
        local.set 2
        local.get 0
        i32.const 1
        i32.add
        i32.const 1
        i32.shr_u
        local.set 0
      end
      local.get 2
      i32.const 1
      i32.add
      local.set 2
      local.get 1
      i32.load offset=16
      local.set 7
      local.get 1
      i32.load offset=24
      local.set 5
      local.get 1
      i32.load offset=20
      local.set 1
      block  ;; label = @2
        loop  ;; label = @3
          local.get 2
          i32.const 1
          i32.sub
          local.tee 2
          i32.eqz
          br_if 1 (;@2;)
          local.get 1
          local.get 7
          local.get 5
          i32.load offset=16
          call_indirect (type 0)
          i32.eqz
          br_if 0 (;@3;)
        end
        i32.const 1
        local.set 3
        br 1 (;@1;)
      end
      i32.const 1
      local.set 3
      local.get 1
      local.get 5
      local.get 8
      local.get 9
      call 34
      br_if 0 (;@1;)
      local.get 1
      local.get 10
      local.get 4
      local.get 5
      i32.load offset=12
      call_indirect (type 2)
      br_if 0 (;@1;)
      i32.const 0
      local.set 2
      loop  ;; label = @2
        local.get 0
        local.get 2
        i32.eq
        if  ;; label = @3
          i32.const 0
          local.set 3
          br 2 (;@1;)
        end
        local.get 2
        i32.const 1
        i32.add
        local.set 2
        local.get 1
        local.get 7
        local.get 5
        i32.load offset=16
        call_indirect (type 0)
        i32.eqz
        br_if 0 (;@2;)
      end
      local.get 2
      i32.const 1
      i32.sub
      local.get 0
      i32.lt_u
      local.set 3
    end
    local.get 6
    i32.const 48
    i32.add
    global.set 0
    local.get 3)
  (func (;7;) (type 4) (param i32)
    (local i32 i32 i32 i32 i32)
    local.get 0
    i32.const 8
    i32.sub
    local.tee 1
    local.get 0
    i32.const 4
    i32.sub
    i32.load
    local.tee 3
    i32.const -8
    i32.and
    local.tee 0
    i32.add
    local.set 2
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            local.get 3
            i32.const 1
            i32.and
            br_if 0 (;@4;)
            local.get 3
            i32.const 2
            i32.and
            i32.eqz
            br_if 1 (;@3;)
            local.get 1
            i32.load
            local.tee 3
            local.get 0
            i32.add
            local.set 0
            local.get 1
            local.get 3
            i32.sub
            local.tee 1
            i32.const 1050392
            i32.load
            i32.eq
            if  ;; label = @5
              local.get 2
              i32.load offset=4
              i32.const 3
              i32.and
              i32.const 3
              i32.ne
              br_if 1 (;@4;)
              i32.const 1050384
              local.get 0
              i32.store
              local.get 2
              local.get 2
              i32.load offset=4
              i32.const -2
              i32.and
              i32.store offset=4
              local.get 1
              local.get 0
              i32.const 1
              i32.or
              i32.store offset=4
              local.get 2
              local.get 0
              i32.store
              return
            end
            local.get 1
            local.get 3
            call 11
          end
          block  ;; label = @4
            block  ;; label = @5
              local.get 2
              i32.load offset=4
              local.tee 3
              i32.const 2
              i32.and
              i32.eqz
              if  ;; label = @6
                local.get 2
                i32.const 1050396
                i32.load
                i32.eq
                br_if 2 (;@4;)
                local.get 2
                i32.const 1050392
                i32.load
                i32.eq
                br_if 5 (;@1;)
                local.get 2
                local.get 3
                i32.const -8
                i32.and
                local.tee 2
                call 11
                local.get 1
                local.get 0
                local.get 2
                i32.add
                local.tee 0
                i32.const 1
                i32.or
                i32.store offset=4
                local.get 0
                local.get 1
                i32.add
                local.get 0
                i32.store
                local.get 1
                i32.const 1050392
                i32.load
                i32.ne
                br_if 1 (;@5;)
                i32.const 1050384
                local.get 0
                i32.store
                return
              end
              local.get 2
              local.get 3
              i32.const -2
              i32.and
              i32.store offset=4
              local.get 1
              local.get 0
              i32.const 1
              i32.or
              i32.store offset=4
              local.get 0
              local.get 1
              i32.add
              local.get 0
              i32.store
            end
            local.get 0
            i32.const 256
            i32.lt_u
            br_if 2 (;@2;)
            local.get 1
            local.get 0
            call 15
            i32.const 0
            local.set 1
            i32.const 1050416
            i32.const 1050416
            i32.load
            i32.const 1
            i32.sub
            local.tee 0
            i32.store
            local.get 0
            br_if 1 (;@3;)
            i32.const 1050104
            i32.load
            local.tee 0
            if  ;; label = @5
              loop  ;; label = @6
                local.get 1
                i32.const 1
                i32.add
                local.set 1
                local.get 0
                i32.load offset=8
                local.tee 0
                br_if 0 (;@6;)
              end
            end
            i32.const 1050416
            i32.const 4095
            local.get 1
            local.get 1
            i32.const 4095
            i32.le_u
            select
            i32.store
            return
          end
          i32.const 1050396
          local.get 1
          i32.store
          i32.const 1050388
          i32.const 1050388
          i32.load
          local.get 0
          i32.add
          local.tee 0
          i32.store
          local.get 1
          local.get 0
          i32.const 1
          i32.or
          i32.store offset=4
          i32.const 1050392
          i32.load
          local.get 1
          i32.eq
          if  ;; label = @4
            i32.const 1050384
            i32.const 0
            i32.store
            i32.const 1050392
            i32.const 0
            i32.store
          end
          local.get 0
          i32.const 1050408
          i32.load
          local.tee 3
          i32.le_u
          br_if 0 (;@3;)
          i32.const 1050396
          i32.load
          local.tee 2
          i32.eqz
          br_if 0 (;@3;)
          i32.const 0
          local.set 1
          block  ;; label = @4
            i32.const 1050388
            i32.load
            local.tee 4
            i32.const 41
            i32.lt_u
            br_if 0 (;@4;)
            i32.const 1050096
            local.set 0
            loop  ;; label = @5
              local.get 2
              local.get 0
              i32.load
              local.tee 5
              i32.ge_u
              if  ;; label = @6
                local.get 5
                local.get 0
                i32.load offset=4
                i32.add
                local.get 2
                i32.gt_u
                br_if 2 (;@4;)
              end
              local.get 0
              i32.load offset=8
              local.tee 0
              br_if 0 (;@5;)
            end
          end
          i32.const 1050104
          i32.load
          local.tee 0
          if  ;; label = @4
            loop  ;; label = @5
              local.get 1
              i32.const 1
              i32.add
              local.set 1
              local.get 0
              i32.load offset=8
              local.tee 0
              br_if 0 (;@5;)
            end
          end
          i32.const 1050416
          i32.const 4095
          local.get 1
          local.get 1
          i32.const 4095
          i32.le_u
          select
          i32.store
          local.get 3
          local.get 4
          i32.ge_u
          br_if 0 (;@3;)
          i32.const 1050408
          i32.const -1
          i32.store
        end
        return
      end
      local.get 0
      i32.const -8
      i32.and
      i32.const 1050112
      i32.add
      local.set 2
      block (result i32)  ;; label = @2
        i32.const 1050376
        i32.load
        local.tee 3
        i32.const 1
        local.get 0
        i32.const 3
        i32.shr_u
        i32.shl
        local.tee 0
        i32.and
        i32.eqz
        if  ;; label = @3
          i32.const 1050376
          local.get 0
          local.get 3
          i32.or
          i32.store
          local.get 2
          br 1 (;@2;)
        end
        local.get 2
        i32.load offset=8
      end
      local.set 0
      local.get 2
      local.get 1
      i32.store offset=8
      local.get 0
      local.get 1
      i32.store offset=12
      local.get 1
      local.get 2
      i32.store offset=12
      local.get 1
      local.get 0
      i32.store offset=8
      return
    end
    i32.const 1050392
    local.get 1
    i32.store
    i32.const 1050384
    i32.const 1050384
    i32.load
    local.get 0
    i32.add
    local.tee 0
    i32.store
    local.get 1
    local.get 0
    i32.const 1
    i32.or
    i32.store offset=4
    local.get 0
    local.get 1
    i32.add
    local.get 0
    i32.store)
  (func (;8;) (type 2) (param i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get 0
    i32.const 48
    i32.sub
    local.tee 3
    global.set 0
    local.get 3
    i32.const 3
    i32.store8 offset=44
    local.get 3
    i32.const 32
    i32.store offset=28
    local.get 3
    i32.const 0
    i32.store offset=40
    local.get 3
    local.get 1
    i32.store offset=36
    local.get 3
    local.get 0
    i32.store offset=32
    local.get 3
    i32.const 0
    i32.store offset=20
    local.get 3
    i32.const 0
    i32.store offset=12
    block (result i32)  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            local.get 2
            i32.load offset=16
            local.tee 10
            i32.eqz
            if  ;; label = @5
              local.get 2
              i32.load offset=12
              local.tee 0
              i32.eqz
              br_if 1 (;@4;)
              local.get 2
              i32.load offset=8
              local.set 1
              local.get 0
              i32.const 3
              i32.shl
              local.set 5
              local.get 0
              i32.const 1
              i32.sub
              i32.const 536870911
              i32.and
              i32.const 1
              i32.add
              local.set 7
              local.get 2
              i32.load
              local.set 0
              loop  ;; label = @6
                local.get 0
                i32.const 4
                i32.add
                i32.load
                local.tee 4
                if  ;; label = @7
                  local.get 3
                  i32.load offset=32
                  local.get 0
                  i32.load
                  local.get 4
                  local.get 3
                  i32.load offset=36
                  i32.load offset=12
                  call_indirect (type 2)
                  br_if 4 (;@3;)
                end
                local.get 1
                i32.load
                local.get 3
                i32.const 12
                i32.add
                local.get 1
                i32.load offset=4
                call_indirect (type 0)
                br_if 3 (;@3;)
                local.get 1
                i32.const 8
                i32.add
                local.set 1
                local.get 0
                i32.const 8
                i32.add
                local.set 0
                local.get 5
                i32.const 8
                i32.sub
                local.tee 5
                br_if 0 (;@6;)
              end
              br 1 (;@4;)
            end
            local.get 2
            i32.load offset=20
            local.tee 0
            i32.eqz
            br_if 0 (;@4;)
            local.get 0
            i32.const 5
            i32.shl
            local.set 11
            local.get 0
            i32.const 1
            i32.sub
            i32.const 134217727
            i32.and
            i32.const 1
            i32.add
            local.set 7
            local.get 2
            i32.load offset=8
            local.set 8
            local.get 2
            i32.load
            local.set 0
            loop  ;; label = @5
              local.get 0
              i32.const 4
              i32.add
              i32.load
              local.tee 1
              if  ;; label = @6
                local.get 3
                i32.load offset=32
                local.get 0
                i32.load
                local.get 1
                local.get 3
                i32.load offset=36
                i32.load offset=12
                call_indirect (type 2)
                br_if 3 (;@3;)
              end
              local.get 3
              local.get 5
              local.get 10
              i32.add
              local.tee 1
              i32.const 16
              i32.add
              i32.load
              i32.store offset=28
              local.get 3
              local.get 1
              i32.const 28
              i32.add
              i32.load8_u
              i32.store8 offset=44
              local.get 3
              local.get 1
              i32.const 24
              i32.add
              i32.load
              i32.store offset=40
              local.get 1
              i32.const 12
              i32.add
              i32.load
              local.set 4
              i32.const 0
              local.set 9
              i32.const 0
              local.set 6
              block  ;; label = @6
                block  ;; label = @7
                  block  ;; label = @8
                    local.get 1
                    i32.const 8
                    i32.add
                    i32.load
                    i32.const 1
                    i32.sub
                    br_table 0 (;@8;) 2 (;@6;) 1 (;@7;)
                  end
                  local.get 4
                  i32.const 3
                  i32.shl
                  local.get 8
                  i32.add
                  local.tee 12
                  i32.load offset=4
                  br_if 1 (;@6;)
                  local.get 12
                  i32.load
                  local.set 4
                end
                i32.const 1
                local.set 6
              end
              local.get 3
              local.get 4
              i32.store offset=16
              local.get 3
              local.get 6
              i32.store offset=12
              local.get 1
              i32.const 4
              i32.add
              i32.load
              local.set 4
              block  ;; label = @6
                block  ;; label = @7
                  block  ;; label = @8
                    local.get 1
                    i32.load
                    i32.const 1
                    i32.sub
                    br_table 0 (;@8;) 2 (;@6;) 1 (;@7;)
                  end
                  local.get 4
                  i32.const 3
                  i32.shl
                  local.get 8
                  i32.add
                  local.tee 6
                  i32.load offset=4
                  br_if 1 (;@6;)
                  local.get 6
                  i32.load
                  local.set 4
                end
                i32.const 1
                local.set 9
              end
              local.get 3
              local.get 4
              i32.store offset=24
              local.get 3
              local.get 9
              i32.store offset=20
              local.get 8
              local.get 1
              i32.const 20
              i32.add
              i32.load
              i32.const 3
              i32.shl
              i32.add
              local.tee 1
              i32.load
              local.get 3
              i32.const 12
              i32.add
              local.get 1
              i32.load offset=4
              call_indirect (type 0)
              br_if 2 (;@3;)
              local.get 0
              i32.const 8
              i32.add
              local.set 0
              local.get 11
              local.get 5
              i32.const 32
              i32.add
              local.tee 5
              i32.ne
              br_if 0 (;@5;)
            end
          end
          local.get 7
          local.get 2
          i32.load offset=4
          i32.ge_u
          br_if 1 (;@2;)
          local.get 3
          i32.load offset=32
          local.get 2
          i32.load
          local.get 7
          i32.const 3
          i32.shl
          i32.add
          local.tee 0
          i32.load
          local.get 0
          i32.load offset=4
          local.get 3
          i32.load offset=36
          i32.load offset=12
          call_indirect (type 2)
          i32.eqz
          br_if 1 (;@2;)
        end
        i32.const 1
        br 1 (;@1;)
      end
      i32.const 0
    end
    local.get 3
    i32.const 48
    i32.add
    global.set 0)
  (func (;9;) (type 1) (param i32 i32)
    (local i32 i32)
    local.get 0
    local.get 1
    i32.add
    local.set 2
    block  ;; label = @1
      block  ;; label = @2
        local.get 0
        i32.load offset=4
        local.tee 3
        i32.const 1
        i32.and
        br_if 0 (;@2;)
        local.get 3
        i32.const 2
        i32.and
        i32.eqz
        br_if 1 (;@1;)
        local.get 0
        i32.load
        local.tee 3
        local.get 1
        i32.add
        local.set 1
        local.get 0
        local.get 3
        i32.sub
        local.tee 0
        i32.const 1050392
        i32.load
        i32.eq
        if  ;; label = @3
          local.get 2
          i32.load offset=4
          i32.const 3
          i32.and
          i32.const 3
          i32.ne
          br_if 1 (;@2;)
          i32.const 1050384
          local.get 1
          i32.store
          local.get 2
          local.get 2
          i32.load offset=4
          i32.const -2
          i32.and
          i32.store offset=4
          local.get 0
          local.get 1
          i32.const 1
          i32.or
          i32.store offset=4
          local.get 2
          local.get 1
          i32.store
          br 2 (;@1;)
        end
        local.get 0
        local.get 3
        call 11
      end
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            local.get 2
            i32.load offset=4
            local.tee 3
            i32.const 2
            i32.and
            i32.eqz
            if  ;; label = @5
              local.get 2
              i32.const 1050396
              i32.load
              i32.eq
              br_if 2 (;@3;)
              local.get 2
              i32.const 1050392
              i32.load
              i32.eq
              br_if 3 (;@2;)
              local.get 2
              local.get 3
              i32.const -8
              i32.and
              local.tee 2
              call 11
              local.get 0
              local.get 1
              local.get 2
              i32.add
              local.tee 1
              i32.const 1
              i32.or
              i32.store offset=4
              local.get 0
              local.get 1
              i32.add
              local.get 1
              i32.store
              local.get 0
              i32.const 1050392
              i32.load
              i32.ne
              br_if 1 (;@4;)
              i32.const 1050384
              local.get 1
              i32.store
              return
            end
            local.get 2
            local.get 3
            i32.const -2
            i32.and
            i32.store offset=4
            local.get 0
            local.get 1
            i32.const 1
            i32.or
            i32.store offset=4
            local.get 0
            local.get 1
            i32.add
            local.get 1
            i32.store
          end
          local.get 1
          i32.const 256
          i32.ge_u
          if  ;; label = @4
            local.get 0
            local.get 1
            call 15
            return
          end
          local.get 1
          i32.const -8
          i32.and
          i32.const 1050112
          i32.add
          local.set 2
          block (result i32)  ;; label = @4
            i32.const 1050376
            i32.load
            local.tee 3
            i32.const 1
            local.get 1
            i32.const 3
            i32.shr_u
            i32.shl
            local.tee 1
            i32.and
            i32.eqz
            if  ;; label = @5
              i32.const 1050376
              local.get 1
              local.get 3
              i32.or
              i32.store
              local.get 2
              br 1 (;@4;)
            end
            local.get 2
            i32.load offset=8
          end
          local.set 1
          local.get 2
          local.get 0
          i32.store offset=8
          local.get 1
          local.get 0
          i32.store offset=12
          local.get 0
          local.get 2
          i32.store offset=12
          local.get 0
          local.get 1
          i32.store offset=8
          return
        end
        i32.const 1050396
        local.get 0
        i32.store
        i32.const 1050388
        i32.const 1050388
        i32.load
        local.get 1
        i32.add
        local.tee 1
        i32.store
        local.get 0
        local.get 1
        i32.const 1
        i32.or
        i32.store offset=4
        local.get 0
        i32.const 1050392
        i32.load
        i32.ne
        br_if 1 (;@1;)
        i32.const 1050384
        i32.const 0
        i32.store
        i32.const 1050392
        i32.const 0
        i32.store
        return
      end
      i32.const 1050392
      local.get 0
      i32.store
      i32.const 1050384
      i32.const 1050384
      i32.load
      local.get 1
      i32.add
      local.tee 1
      i32.store
      local.get 0
      local.get 1
      i32.const 1
      i32.or
      i32.store offset=4
      local.get 0
      local.get 1
      i32.add
      local.get 1
      i32.store
    end)
  (func (;10;) (type 0) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32)
    block  ;; label = @1
      i32.const -65587
      i32.const 16
      local.get 0
      local.get 0
      i32.const 16
      i32.le_u
      select
      local.tee 0
      i32.sub
      local.get 1
      i32.le_u
      br_if 0 (;@1;)
      local.get 0
      i32.const 16
      local.get 1
      i32.const 11
      i32.add
      i32.const -8
      i32.and
      local.get 1
      i32.const 11
      i32.lt_u
      select
      local.tee 4
      i32.add
      i32.const 12
      i32.add
      call 4
      local.tee 2
      i32.eqz
      br_if 0 (;@1;)
      local.get 2
      i32.const 8
      i32.sub
      local.set 1
      block  ;; label = @2
        local.get 0
        i32.const 1
        i32.sub
        local.tee 3
        local.get 2
        i32.and
        i32.eqz
        if  ;; label = @3
          local.get 1
          local.set 0
          br 1 (;@2;)
        end
        local.get 2
        i32.const 4
        i32.sub
        local.tee 5
        i32.load
        local.tee 6
        i32.const -8
        i32.and
        local.get 2
        local.get 3
        i32.add
        i32.const 0
        local.get 0
        i32.sub
        i32.and
        i32.const 8
        i32.sub
        local.tee 2
        local.get 0
        i32.const 0
        local.get 2
        local.get 1
        i32.sub
        i32.const 16
        i32.le_u
        select
        i32.add
        local.tee 0
        local.get 1
        i32.sub
        local.tee 2
        i32.sub
        local.set 3
        local.get 6
        i32.const 3
        i32.and
        if  ;; label = @3
          local.get 0
          local.get 3
          local.get 0
          i32.load offset=4
          i32.const 1
          i32.and
          i32.or
          i32.const 2
          i32.or
          i32.store offset=4
          local.get 0
          local.get 3
          i32.add
          local.tee 3
          local.get 3
          i32.load offset=4
          i32.const 1
          i32.or
          i32.store offset=4
          local.get 5
          local.get 2
          local.get 5
          i32.load
          i32.const 1
          i32.and
          i32.or
          i32.const 2
          i32.or
          i32.store
          local.get 1
          local.get 2
          i32.add
          local.tee 3
          local.get 3
          i32.load offset=4
          i32.const 1
          i32.or
          i32.store offset=4
          local.get 1
          local.get 2
          call 9
          br 1 (;@2;)
        end
        local.get 1
        i32.load
        local.set 1
        local.get 0
        local.get 3
        i32.store offset=4
        local.get 0
        local.get 1
        local.get 2
        i32.add
        i32.store
      end
      block  ;; label = @2
        local.get 0
        i32.load offset=4
        local.tee 1
        i32.const 3
        i32.and
        i32.eqz
        br_if 0 (;@2;)
        local.get 1
        i32.const -8
        i32.and
        local.tee 2
        local.get 4
        i32.const 16
        i32.add
        i32.le_u
        br_if 0 (;@2;)
        local.get 0
        local.get 4
        local.get 1
        i32.const 1
        i32.and
        i32.or
        i32.const 2
        i32.or
        i32.store offset=4
        local.get 0
        local.get 4
        i32.add
        local.tee 1
        local.get 2
        local.get 4
        i32.sub
        local.tee 4
        i32.const 3
        i32.or
        i32.store offset=4
        local.get 0
        local.get 2
        i32.add
        local.tee 2
        local.get 2
        i32.load offset=4
        i32.const 1
        i32.or
        i32.store offset=4
        local.get 1
        local.get 4
        call 9
      end
      local.get 0
      i32.const 8
      i32.add
      local.set 3
    end
    local.get 3)
  (func (;11;) (type 1) (param i32 i32)
    (local i32 i32 i32 i32)
    local.get 0
    i32.load offset=12
    local.set 2
    block  ;; label = @1
      block  ;; label = @2
        local.get 1
        i32.const 256
        i32.ge_u
        if  ;; label = @3
          local.get 0
          i32.load offset=24
          local.set 3
          block  ;; label = @4
            block  ;; label = @5
              local.get 0
              local.get 2
              i32.eq
              if  ;; label = @6
                local.get 0
                i32.const 20
                i32.const 16
                local.get 0
                i32.load offset=20
                local.tee 2
                select
                i32.add
                i32.load
                local.tee 1
                br_if 1 (;@5;)
                i32.const 0
                local.set 2
                br 2 (;@4;)
              end
              local.get 0
              i32.load offset=8
              local.tee 1
              local.get 2
              i32.store offset=12
              local.get 2
              local.get 1
              i32.store offset=8
              br 1 (;@4;)
            end
            local.get 0
            i32.const 20
            i32.add
            local.get 0
            i32.const 16
            i32.add
            local.get 2
            select
            local.set 4
            loop  ;; label = @5
              local.get 4
              local.set 5
              local.get 1
              local.tee 2
              i32.const 20
              i32.add
              local.get 2
              i32.const 16
              i32.add
              local.get 2
              i32.load offset=20
              local.tee 1
              select
              local.set 4
              local.get 2
              i32.const 20
              i32.const 16
              local.get 1
              select
              i32.add
              i32.load
              local.tee 1
              br_if 0 (;@5;)
            end
            local.get 5
            i32.const 0
            i32.store
          end
          local.get 3
          i32.eqz
          br_if 2 (;@1;)
          local.get 0
          local.get 0
          i32.load offset=28
          i32.const 2
          i32.shl
          i32.const 1049968
          i32.add
          local.tee 1
          i32.load
          i32.ne
          if  ;; label = @4
            local.get 3
            i32.const 16
            i32.const 20
            local.get 3
            i32.load offset=16
            local.get 0
            i32.eq
            select
            i32.add
            local.get 2
            i32.store
            local.get 2
            i32.eqz
            br_if 3 (;@1;)
            br 2 (;@2;)
          end
          local.get 1
          local.get 2
          i32.store
          local.get 2
          br_if 1 (;@2;)
          i32.const 1050380
          i32.const 1050380
          i32.load
          i32.const -2
          local.get 0
          i32.load offset=28
          i32.rotl
          i32.and
          i32.store
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=8
        local.tee 0
        local.get 2
        i32.ne
        if  ;; label = @3
          local.get 0
          local.get 2
          i32.store offset=12
          local.get 2
          local.get 0
          i32.store offset=8
          return
        end
        i32.const 1050376
        i32.const 1050376
        i32.load
        i32.const -2
        local.get 1
        i32.const 3
        i32.shr_u
        i32.rotl
        i32.and
        i32.store
        return
      end
      local.get 2
      local.get 3
      i32.store offset=24
      local.get 0
      i32.load offset=16
      local.tee 1
      if  ;; label = @2
        local.get 2
        local.get 1
        i32.store offset=16
        local.get 1
        local.get 2
        i32.store offset=24
      end
      local.get 0
      i32.load offset=20
      local.tee 0
      i32.eqz
      br_if 0 (;@1;)
      local.get 2
      local.get 0
      i32.store offset=20
      local.get 0
      local.get 2
      i32.store offset=24
    end)
  (func (;12;) (type 0) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 3
    global.set 0
    block  ;; label = @1
      block (result i32)  ;; label = @2
        block  ;; label = @3
          local.get 1
          i32.const 128
          i32.ge_u
          if  ;; label = @4
            local.get 3
            i32.const 0
            i32.store offset=12
            local.get 1
            i32.const 2048
            i32.lt_u
            br_if 1 (;@3;)
            local.get 1
            i32.const 65536
            i32.lt_u
            if  ;; label = @5
              local.get 3
              local.get 1
              i32.const 63
              i32.and
              i32.const 128
              i32.or
              i32.store8 offset=14
              local.get 3
              local.get 1
              i32.const 12
              i32.shr_u
              i32.const 224
              i32.or
              i32.store8 offset=12
              local.get 3
              local.get 1
              i32.const 6
              i32.shr_u
              i32.const 63
              i32.and
              i32.const 128
              i32.or
              i32.store8 offset=13
              i32.const 3
              br 3 (;@2;)
            end
            local.get 3
            local.get 1
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=15
            local.get 3
            local.get 1
            i32.const 6
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=14
            local.get 3
            local.get 1
            i32.const 12
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=13
            local.get 3
            local.get 1
            i32.const 18
            i32.shr_u
            i32.const 7
            i32.and
            i32.const 240
            i32.or
            i32.store8 offset=12
            i32.const 4
            br 2 (;@2;)
          end
          local.get 0
          i32.load offset=8
          local.tee 7
          local.get 0
          i32.load
          i32.eq
          if  ;; label = @4
            global.get 0
            i32.const 32
            i32.sub
            local.tee 2
            global.set 0
            local.get 0
            i32.load
            local.tee 5
            i32.const 1
            i32.add
            local.tee 4
            i32.eqz
            if  ;; label = @5
              i32.const 0
              i32.const 0
              call 49
              unreachable
            end
            i32.const 8
            local.get 5
            i32.const 1
            i32.shl
            local.tee 6
            local.get 4
            local.get 4
            local.get 6
            i32.lt_u
            select
            local.tee 4
            local.get 4
            i32.const 8
            i32.le_u
            select
            local.tee 4
            i32.const -1
            i32.xor
            i32.const 31
            i32.shr_u
            local.set 6
            local.get 2
            local.get 5
            if (result i32)  ;; label = @5
              local.get 2
              local.get 5
              i32.store offset=28
              local.get 2
              local.get 0
              i32.load offset=4
              i32.store offset=20
              i32.const 1
            else
              i32.const 0
            end
            i32.store offset=24
            local.get 2
            i32.const 8
            i32.add
            local.get 6
            local.get 4
            local.get 2
            i32.const 20
            i32.add
            call 24
            local.get 2
            i32.load offset=8
            if  ;; label = @5
              local.get 2
              i32.load offset=12
              local.get 2
              i32.load offset=16
              call 49
              unreachable
            end
            local.get 2
            i32.load offset=12
            local.set 5
            local.get 0
            local.get 4
            i32.store
            local.get 0
            local.get 5
            i32.store offset=4
            local.get 2
            i32.const 32
            i32.add
            global.set 0
          end
          local.get 0
          local.get 7
          i32.const 1
          i32.add
          i32.store offset=8
          local.get 0
          i32.load offset=4
          local.get 7
          i32.add
          local.get 1
          i32.store8
          br 2 (;@1;)
        end
        local.get 3
        local.get 1
        i32.const 63
        i32.and
        i32.const 128
        i32.or
        i32.store8 offset=13
        local.get 3
        local.get 1
        i32.const 6
        i32.shr_u
        i32.const 192
        i32.or
        i32.store8 offset=12
        i32.const 2
      end
      local.set 1
      local.get 1
      local.get 0
      i32.load
      local.get 0
      i32.load offset=8
      local.tee 2
      i32.sub
      i32.gt_u
      if  ;; label = @2
        local.get 0
        local.get 2
        local.get 1
        call 20
        local.get 0
        i32.load offset=8
        local.set 2
      end
      local.get 0
      i32.load offset=4
      local.get 2
      i32.add
      local.get 3
      i32.const 12
      i32.add
      local.get 1
      call 60
      drop
      local.get 0
      local.get 1
      local.get 2
      i32.add
      i32.store offset=8
    end
    local.get 3
    i32.const 16
    i32.add
    global.set 0
    i32.const 0)
  (func (;13;) (type 0) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 3
    global.set 0
    block  ;; label = @1
      block (result i32)  ;; label = @2
        block  ;; label = @3
          local.get 1
          i32.const 128
          i32.ge_u
          if  ;; label = @4
            local.get 3
            i32.const 0
            i32.store offset=12
            local.get 1
            i32.const 2048
            i32.lt_u
            br_if 1 (;@3;)
            local.get 1
            i32.const 65536
            i32.lt_u
            if  ;; label = @5
              local.get 3
              local.get 1
              i32.const 63
              i32.and
              i32.const 128
              i32.or
              i32.store8 offset=14
              local.get 3
              local.get 1
              i32.const 12
              i32.shr_u
              i32.const 224
              i32.or
              i32.store8 offset=12
              local.get 3
              local.get 1
              i32.const 6
              i32.shr_u
              i32.const 63
              i32.and
              i32.const 128
              i32.or
              i32.store8 offset=13
              i32.const 3
              br 3 (;@2;)
            end
            local.get 3
            local.get 1
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=15
            local.get 3
            local.get 1
            i32.const 6
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=14
            local.get 3
            local.get 1
            i32.const 12
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=13
            local.get 3
            local.get 1
            i32.const 18
            i32.shr_u
            i32.const 7
            i32.and
            i32.const 240
            i32.or
            i32.store8 offset=12
            i32.const 4
            br 2 (;@2;)
          end
          local.get 0
          i32.load offset=8
          local.tee 7
          local.get 0
          i32.load
          i32.eq
          if  ;; label = @4
            global.get 0
            i32.const 32
            i32.sub
            local.tee 2
            global.set 0
            local.get 0
            i32.load
            local.tee 5
            i32.const 1
            i32.add
            local.tee 4
            i32.eqz
            if  ;; label = @5
              i32.const 0
              i32.const 0
              call 49
              unreachable
            end
            i32.const 8
            local.get 5
            i32.const 1
            i32.shl
            local.tee 6
            local.get 4
            local.get 4
            local.get 6
            i32.lt_u
            select
            local.tee 4
            local.get 4
            i32.const 8
            i32.le_u
            select
            local.tee 4
            i32.const -1
            i32.xor
            i32.const 31
            i32.shr_u
            local.set 6
            local.get 2
            local.get 5
            if (result i32)  ;; label = @5
              local.get 2
              local.get 5
              i32.store offset=28
              local.get 2
              local.get 0
              i32.load offset=4
              i32.store offset=20
              i32.const 1
            else
              i32.const 0
            end
            i32.store offset=24
            local.get 2
            i32.const 8
            i32.add
            local.get 6
            local.get 4
            local.get 2
            i32.const 20
            i32.add
            call 23
            local.get 2
            i32.load offset=8
            if  ;; label = @5
              local.get 2
              i32.load offset=12
              local.get 2
              i32.load offset=16
              call 49
              unreachable
            end
            local.get 2
            i32.load offset=12
            local.set 5
            local.get 0
            local.get 4
            i32.store
            local.get 0
            local.get 5
            i32.store offset=4
            local.get 2
            i32.const 32
            i32.add
            global.set 0
          end
          local.get 0
          local.get 7
          i32.const 1
          i32.add
          i32.store offset=8
          local.get 0
          i32.load offset=4
          local.get 7
          i32.add
          local.get 1
          i32.store8
          br 2 (;@1;)
        end
        local.get 3
        local.get 1
        i32.const 63
        i32.and
        i32.const 128
        i32.or
        i32.store8 offset=13
        local.get 3
        local.get 1
        i32.const 6
        i32.shr_u
        i32.const 192
        i32.or
        i32.store8 offset=12
        i32.const 2
      end
      local.set 1
      local.get 1
      local.get 0
      i32.load
      local.get 0
      i32.load offset=8
      local.tee 2
      i32.sub
      i32.gt_u
      if  ;; label = @2
        local.get 0
        local.get 2
        local.get 1
        call 21
        local.get 0
        i32.load offset=8
        local.set 2
      end
      local.get 0
      i32.load offset=4
      local.get 2
      i32.add
      local.get 3
      i32.const 12
      i32.add
      local.get 1
      call 60
      drop
      local.get 0
      local.get 1
      local.get 2
      i32.add
      i32.store offset=8
    end
    local.get 3
    i32.const 16
    i32.add
    global.set 0
    i32.const 0)
  (func (;14;) (type 3) (param i32 i32 i32)
    (local i32 i32 i32 i32)
    global.get 0
    i32.const 80
    i32.sub
    local.tee 3
    global.set 0
    local.get 3
    i32.const 16
    i32.add
    local.get 1
    local.get 2
    call 32
    local.get 3
    i32.load offset=16
    local.set 1
    local.get 3
    local.get 3
    i32.load offset=20
    local.tee 4
    i32.store offset=28
    local.get 3
    local.get 1
    i32.store offset=24
    local.get 3
    i32.const 2
    i32.store offset=36
    local.get 3
    i32.const 1048820
    i32.store offset=32
    local.get 3
    i64.const 1
    i64.store offset=44 align=4
    local.get 3
    i32.const 1
    i32.store offset=60
    i32.const 1050425
    i32.load8_u
    drop
    local.get 3
    local.get 3
    i32.const 56
    i32.add
    i32.store offset=40
    local.get 3
    local.get 3
    i32.const 24
    i32.add
    i32.store offset=56
    block  ;; label = @1
      i32.const 14
      call 4
      local.tee 2
      if  ;; label = @2
        local.get 3
        i32.const 0
        i32.store offset=72
        local.get 3
        local.get 2
        i32.store offset=68
        local.get 3
        i32.const 14
        i32.store offset=64
        local.get 3
        i32.const -64
        i32.sub
        i32.const 1048836
        local.get 3
        i32.const 32
        i32.add
        call 8
        br_if 1 (;@1;)
        local.get 3
        i32.load offset=72
        local.set 6
        local.get 3
        i32.load offset=68
        local.set 2
        local.get 3
        i32.load offset=64
        local.set 5
        local.get 4
        if  ;; label = @3
          local.get 1
          local.get 4
          call 29
        end
        local.get 0
        block (result i32)  ;; label = @3
          local.get 5
          i32.const -2147483648
          i32.eq
          if  ;; label = @4
            i32.const 0
            local.set 4
            i32.const 0
            local.set 5
            i32.const 1
            br 1 (;@3;)
          end
          local.get 3
          local.get 6
          i32.store offset=40
          local.get 3
          local.get 2
          i32.store offset=36
          local.get 3
          local.get 5
          i32.store offset=32
          local.get 3
          i32.const 8
          i32.add
          local.get 3
          i32.const 32
          i32.add
          call 28
          local.get 3
          i32.load offset=12
          local.set 5
          local.get 3
          i32.load offset=8
          local.set 4
          i32.const 0
          local.set 2
          i32.const 0
        end
        i32.store offset=12
        local.get 0
        local.get 2
        i32.store offset=8
        local.get 0
        local.get 5
        i32.store offset=4
        local.get 0
        local.get 4
        i32.store
        local.get 3
        i32.const 80
        i32.add
        global.set 0
        return
      end
      unreachable
    end
    i32.const 1048932
    i32.const 51
    local.get 3
    i32.const 79
    i32.add
    i32.const 1048984
    i32.const 1049024
    call 26
    unreachable)
  (func (;15;) (type 1) (param i32 i32)
    (local i32 i32 i32 i32)
    i32.const 31
    local.set 2
    local.get 0
    i64.const 0
    i64.store offset=16 align=4
    local.get 1
    i32.const 16777215
    i32.le_u
    if  ;; label = @1
      local.get 1
      i32.const 6
      local.get 1
      i32.const 8
      i32.shr_u
      i32.clz
      local.tee 3
      i32.sub
      i32.shr_u
      i32.const 1
      i32.and
      local.get 3
      i32.const 1
      i32.shl
      i32.sub
      i32.const 62
      i32.add
      local.set 2
    end
    local.get 0
    local.get 2
    i32.store offset=28
    local.get 2
    i32.const 2
    i32.shl
    i32.const 1049968
    i32.add
    local.set 4
    i32.const 1
    local.get 2
    i32.shl
    local.tee 3
    i32.const 1050380
    i32.load
    i32.and
    i32.eqz
    if  ;; label = @1
      local.get 4
      local.get 0
      i32.store
      local.get 0
      local.get 4
      i32.store offset=24
      local.get 0
      local.get 0
      i32.store offset=12
      local.get 0
      local.get 0
      i32.store offset=8
      i32.const 1050380
      i32.const 1050380
      i32.load
      local.get 3
      i32.or
      i32.store
      return
    end
    block  ;; label = @1
      block  ;; label = @2
        local.get 1
        local.get 4
        i32.load
        local.tee 3
        i32.load offset=4
        i32.const -8
        i32.and
        i32.eq
        if  ;; label = @3
          local.get 3
          local.set 2
          br 1 (;@2;)
        end
        local.get 1
        i32.const 25
        local.get 2
        i32.const 1
        i32.shr_u
        i32.sub
        i32.const 0
        local.get 2
        i32.const 31
        i32.ne
        select
        i32.shl
        local.set 5
        loop  ;; label = @3
          local.get 3
          local.get 5
          i32.const 29
          i32.shr_u
          i32.const 4
          i32.and
          i32.add
          i32.const 16
          i32.add
          local.tee 4
          i32.load
          local.tee 2
          i32.eqz
          br_if 2 (;@1;)
          local.get 5
          i32.const 1
          i32.shl
          local.set 5
          local.get 2
          local.set 3
          local.get 2
          i32.load offset=4
          i32.const -8
          i32.and
          local.get 1
          i32.ne
          br_if 0 (;@3;)
        end
      end
      local.get 2
      i32.load offset=8
      local.tee 1
      local.get 0
      i32.store offset=12
      local.get 2
      local.get 0
      i32.store offset=8
      local.get 0
      i32.const 0
      i32.store offset=24
      local.get 0
      local.get 2
      i32.store offset=12
      local.get 0
      local.get 1
      i32.store offset=8
      return
    end
    local.get 4
    local.get 0
    i32.store
    local.get 0
    local.get 3
    i32.store offset=24
    local.get 0
    local.get 0
    i32.store offset=12
    local.get 0
    local.get 0
    i32.store offset=8)
  (func (;16;) (type 0) (param i32 i32) (result i32)
    (local i32 i32 i32 i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 2
    global.set 0
    block  ;; label = @1
      block (result i32)  ;; label = @2
        block  ;; label = @3
          local.get 1
          i32.const 128
          i32.ge_u
          if  ;; label = @4
            local.get 2
            i32.const 0
            i32.store offset=12
            local.get 1
            i32.const 2048
            i32.lt_u
            br_if 1 (;@3;)
            local.get 1
            i32.const 65536
            i32.lt_u
            if  ;; label = @5
              local.get 2
              local.get 1
              i32.const 12
              i32.shr_u
              i32.const 224
              i32.or
              i32.store8 offset=12
              local.get 2
              local.get 1
              i32.const 6
              i32.shr_u
              i32.const 63
              i32.and
              i32.const 128
              i32.or
              i32.store8 offset=13
              i32.const 2
              local.set 3
              i32.const 3
              br 3 (;@2;)
            end
            local.get 2
            local.get 1
            i32.const 6
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=14
            local.get 2
            local.get 1
            i32.const 12
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=13
            local.get 2
            local.get 1
            i32.const 18
            i32.shr_u
            i32.const 7
            i32.and
            i32.const 240
            i32.or
            i32.store8 offset=12
            i32.const 3
            local.set 3
            i32.const 4
            br 2 (;@2;)
          end
          local.get 0
          i32.load offset=8
          local.tee 4
          local.get 0
          i32.load
          i32.eq
          if  ;; label = @4
            global.get 0
            i32.const 16
            i32.sub
            local.tee 3
            global.set 0
            local.get 3
            i32.const 8
            i32.add
            local.get 0
            local.get 0
            i32.load
            i32.const 1
            call 18
            local.get 3
            i32.load offset=8
            local.tee 5
            i32.const -2147483647
            i32.ne
            if  ;; label = @5
              local.get 5
              local.get 3
              i32.load offset=12
              call 49
              unreachable
            end
            local.get 3
            i32.const 16
            i32.add
            global.set 0
          end
          local.get 0
          local.get 4
          i32.const 1
          i32.add
          i32.store offset=8
          local.get 0
          i32.load offset=4
          local.get 4
          i32.add
          local.get 1
          i32.store8
          br 2 (;@1;)
        end
        local.get 2
        local.get 1
        i32.const 6
        i32.shr_u
        i32.const 192
        i32.or
        i32.store8 offset=12
        i32.const 1
        local.set 3
        i32.const 2
      end
      local.set 4
      local.get 3
      local.get 2
      i32.const 12
      i32.add
      local.tee 5
      i32.or
      local.get 1
      i32.const 63
      i32.and
      i32.const 128
      i32.or
      i32.store8
      local.get 0
      local.get 5
      local.get 4
      call 50
    end
    local.get 2
    i32.const 16
    i32.add
    global.set 0
    i32.const 0)
  (func (;17;) (type 1) (param i32 i32)
    (local i32 i32 i32 i64)
    global.get 0
    i32.const 48
    i32.sub
    local.tee 2
    global.set 0
    local.get 1
    i32.load
    i32.const -2147483648
    i32.eq
    if  ;; label = @1
      local.get 1
      i32.load offset=12
      local.set 3
      local.get 2
      i32.const 44
      i32.add
      local.tee 4
      i32.const 0
      i32.store
      local.get 2
      i64.const 4294967296
      i64.store offset=36 align=4
      local.get 2
      i32.const 36
      i32.add
      i32.const 1049568
      local.get 3
      call 8
      drop
      local.get 2
      i32.const 32
      i32.add
      local.get 4
      i32.load
      local.tee 3
      i32.store
      local.get 2
      local.get 2
      i64.load offset=36 align=4
      local.tee 5
      i64.store offset=24
      local.get 1
      i32.const 8
      i32.add
      local.get 3
      i32.store
      local.get 1
      local.get 5
      i64.store align=4
    end
    local.get 1
    i64.load align=4
    local.set 5
    local.get 1
    i64.const 4294967296
    i64.store align=4
    local.get 2
    i32.const 16
    i32.add
    local.tee 3
    local.get 1
    i32.const 8
    i32.add
    local.tee 1
    i32.load
    i32.store
    local.get 1
    i32.const 0
    i32.store
    i32.const 1050425
    i32.load8_u
    drop
    local.get 2
    local.get 5
    i64.store offset=8
    i32.const 12
    call 4
    local.tee 1
    i32.eqz
    if  ;; label = @1
      unreachable
    end
    local.get 1
    local.get 2
    i64.load offset=8
    i64.store align=4
    local.get 1
    i32.const 8
    i32.add
    local.get 3
    i32.load
    i32.store
    local.get 0
    i32.const 1049880
    i32.store offset=4
    local.get 0
    local.get 1
    i32.store
    local.get 2
    i32.const 48
    i32.add
    global.set 0)
  (func (;18;) (type 6) (param i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32)
    global.get 0
    i32.const 32
    i32.sub
    local.tee 4
    global.set 0
    block (result i32)  ;; label = @1
      i32.const 0
      local.get 2
      local.get 2
      local.get 3
      i32.add
      local.tee 3
      i32.gt_u
      br_if 0 (;@1;)
      drop
      i32.const 1
      local.set 2
      i32.const 8
      local.get 1
      i32.load
      local.tee 5
      i32.const 1
      i32.shl
      local.tee 8
      local.get 3
      local.get 3
      local.get 8
      i32.lt_u
      select
      local.tee 3
      local.get 3
      i32.const 8
      i32.le_u
      select
      local.tee 8
      i32.const -1
      i32.xor
      i32.const 31
      i32.shr_u
      local.set 3
      block  ;; label = @2
        local.get 5
        i32.eqz
        if  ;; label = @3
          i32.const 0
          local.set 2
          br 1 (;@2;)
        end
        local.get 4
        local.get 5
        i32.store offset=28
        local.get 4
        local.get 1
        i32.load offset=4
        i32.store offset=20
      end
      local.get 4
      local.get 2
      i32.store offset=24
      local.get 4
      i32.const 8
      i32.add
      local.set 9
      local.get 4
      i32.const 20
      i32.add
      local.set 6
      i32.const 0
      local.set 5
      global.get 0
      i32.const 16
      i32.sub
      local.tee 7
      global.set 0
      i32.const 1
      local.set 10
      block (result i32)  ;; label = @2
        i32.const 4
        local.get 3
        i32.eqz
        local.get 8
        local.tee 2
        i32.const 0
        i32.lt_s
        i32.or
        br_if 0 (;@2;)
        drop
        block (result i32)  ;; label = @3
          local.get 6
          i32.load offset=4
          if  ;; label = @4
            local.get 6
            i32.load offset=8
            local.tee 5
            i32.eqz
            if  ;; label = @5
              local.get 7
              i32.const 8
              i32.add
              local.get 3
              local.get 2
              call 39
              local.get 7
              i32.load offset=8
              local.set 6
              local.get 7
              i32.load offset=12
              br 2 (;@3;)
            end
            local.get 6
            i32.load
            local.get 5
            local.get 3
            local.get 2
            call 5
            local.set 6
            local.get 2
            br 1 (;@3;)
          end
          local.get 7
          local.get 3
          local.get 2
          call 39
          local.get 7
          i32.load
          local.set 6
          local.get 7
          i32.load offset=4
        end
        local.set 5
        local.get 6
        if  ;; label = @3
          local.get 9
          local.get 6
          i32.store offset=4
          i32.const 0
          local.set 10
          i32.const 8
          br 1 (;@2;)
        end
        local.get 9
        local.get 3
        i32.store offset=4
        local.get 2
        local.set 5
        i32.const 8
      end
      local.get 9
      i32.add
      local.get 5
      i32.store
      local.get 9
      local.get 10
      i32.store
      local.get 7
      i32.const 16
      i32.add
      global.set 0
      local.get 4
      i32.load offset=8
      i32.eqz
      if  ;; label = @2
        local.get 4
        i32.load offset=12
        local.set 2
        local.get 1
        local.get 8
        i32.store
        local.get 1
        local.get 2
        i32.store offset=4
        i32.const -2147483647
        br 1 (;@1;)
      end
      local.get 4
      i32.load offset=16
      local.set 1
      local.get 4
      i32.load offset=12
    end
    local.set 2
    local.get 0
    local.get 1
    i32.store offset=4
    local.get 0
    local.get 2
    i32.store
    local.get 4
    i32.const 32
    i32.add
    global.set 0)
  (func (;19;) (type 9)
    (local i32)
    global.get 0
    i32.const 32
    i32.sub
    local.tee 0
    global.set 0
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  i32.const 1049952
                  i32.load8_u
                  i32.const 1
                  i32.sub
                  br_table 4 (;@3;) 3 (;@4;) 1 (;@6;) 0 (;@7;)
                end
                i32.const 1049952
                i32.const 2
                i32.store8
                i32.const 1049964
                i32.load
                i32.const 2147483647
                i32.and
                if  ;; label = @7
                  i32.const 1050420
                  i32.load
                  br_if 2 (;@5;)
                end
                i32.const 1049956
                i32.load
                br_if 4 (;@2;)
                i32.const 1049960
                i32.const 1
                i32.store
                i32.const 1049952
                i32.const 3
                i32.store8
                i32.const 1049956
                i32.const 0
                i32.store
              end
              local.get 0
              i32.const 32
              i32.add
              global.set 0
              return
            end
            local.get 0
            i32.const 0
            i32.store offset=24
            local.get 0
            i32.const 1
            i32.store offset=12
            local.get 0
            i32.const 1049812
            i32.store offset=8
            local.get 0
            i64.const 4
            i64.store offset=16 align=4
            local.get 0
            i32.const 8
            i32.add
            i32.const 1049848
            call 36
            unreachable
          end
          local.get 0
          i32.const 0
          i32.store offset=24
          local.get 0
          i32.const 1
          i32.store offset=12
          local.get 0
          i32.const 1048804
          i32.store offset=8
          br 2 (;@1;)
        end
        local.get 0
        i32.const 0
        i32.store offset=24
        local.get 0
        i32.const 1
        i32.store offset=12
        local.get 0
        i32.const 1048740
        i32.store offset=8
        br 1 (;@1;)
      end
      unreachable
    end
    local.get 0
    i64.const 4
    i64.store offset=16 align=4
    local.get 0
    i32.const 8
    i32.add
    i32.const 1048680
    call 36
    unreachable)
  (func (;20;) (type 3) (param i32 i32 i32)
    (local i32 i32 i32)
    global.get 0
    i32.const 32
    i32.sub
    local.tee 3
    global.set 0
    local.get 1
    local.get 1
    local.get 2
    i32.add
    local.tee 2
    i32.gt_u
    if  ;; label = @1
      i32.const 0
      i32.const 0
      call 49
      unreachable
    end
    i32.const 1
    local.set 1
    i32.const 8
    local.get 0
    i32.load
    local.tee 5
    i32.const 1
    i32.shl
    local.tee 4
    local.get 2
    local.get 2
    local.get 4
    i32.lt_u
    select
    local.tee 2
    local.get 2
    i32.const 8
    i32.le_u
    select
    local.tee 2
    i32.const -1
    i32.xor
    i32.const 31
    i32.shr_u
    local.set 4
    block  ;; label = @1
      local.get 5
      i32.eqz
      if  ;; label = @2
        i32.const 0
        local.set 1
        br 1 (;@1;)
      end
      local.get 3
      local.get 5
      i32.store offset=28
      local.get 3
      local.get 0
      i32.load offset=4
      i32.store offset=20
    end
    local.get 3
    local.get 1
    i32.store offset=24
    local.get 3
    i32.const 8
    i32.add
    local.get 4
    local.get 2
    local.get 3
    i32.const 20
    i32.add
    call 24
    local.get 3
    i32.load offset=8
    if  ;; label = @1
      local.get 3
      i32.load offset=12
      local.get 3
      i32.load offset=16
      call 49
      unreachable
    end
    local.get 3
    i32.load offset=12
    local.set 1
    local.get 0
    local.get 2
    i32.store
    local.get 0
    local.get 1
    i32.store offset=4
    local.get 3
    i32.const 32
    i32.add
    global.set 0)
  (func (;21;) (type 3) (param i32 i32 i32)
    (local i32 i32 i32)
    global.get 0
    i32.const 32
    i32.sub
    local.tee 3
    global.set 0
    local.get 1
    local.get 1
    local.get 2
    i32.add
    local.tee 2
    i32.gt_u
    if  ;; label = @1
      i32.const 0
      i32.const 0
      call 49
      unreachable
    end
    i32.const 1
    local.set 1
    i32.const 8
    local.get 0
    i32.load
    local.tee 5
    i32.const 1
    i32.shl
    local.tee 4
    local.get 2
    local.get 2
    local.get 4
    i32.lt_u
    select
    local.tee 2
    local.get 2
    i32.const 8
    i32.le_u
    select
    local.tee 2
    i32.const -1
    i32.xor
    i32.const 31
    i32.shr_u
    local.set 4
    block  ;; label = @1
      local.get 5
      i32.eqz
      if  ;; label = @2
        i32.const 0
        local.set 1
        br 1 (;@1;)
      end
      local.get 3
      local.get 5
      i32.store offset=28
      local.get 3
      local.get 0
      i32.load offset=4
      i32.store offset=20
    end
    local.get 3
    local.get 1
    i32.store offset=24
    local.get 3
    i32.const 8
    i32.add
    local.get 4
    local.get 2
    local.get 3
    i32.const 20
    i32.add
    call 23
    local.get 3
    i32.load offset=8
    if  ;; label = @1
      local.get 3
      i32.load offset=12
      local.get 3
      i32.load offset=16
      call 49
      unreachable
    end
    local.get 3
    i32.load offset=12
    local.set 1
    local.get 0
    local.get 2
    i32.store
    local.get 0
    local.get 1
    i32.store offset=4
    local.get 3
    i32.const 32
    i32.add
    global.set 0)
  (func (;22;) (type 10) (param i32 i32 i32 i32 i32 i32)
    (local i32 i32)
    global.get 0
    i32.const 32
    i32.sub
    local.tee 6
    global.set 0
    i32.const 1049964
    i32.const 1049964
    i32.load
    local.tee 7
    i32.const 1
    i32.add
    i32.store
    block  ;; label = @1
      block  ;; label = @2
        local.get 7
        i32.const 0
        i32.lt_s
        br_if 0 (;@2;)
        i32.const 1050424
        i32.load8_u
        i32.const 1
        i32.and
        br_if 0 (;@2;)
        i32.const 1050424
        i32.const 1
        i32.store8
        i32.const 1050420
        i32.const 1050420
        i32.load
        i32.const 1
        i32.add
        i32.store
        local.get 6
        local.get 5
        i32.store8 offset=29
        local.get 6
        local.get 4
        i32.store8 offset=28
        local.get 6
        local.get 3
        i32.store offset=24
        local.get 6
        local.get 2
        i32.store offset=20
        i32.const 1049956
        i32.load
        local.tee 2
        i32.const 0
        i32.lt_s
        br_if 0 (;@2;)
        i32.const 1049956
        local.get 2
        i32.const 1
        i32.add
        i32.store
        i32.const 1049956
        i32.const 1049960
        i32.load
        if (result i32)  ;; label = @3
          local.get 6
          local.get 0
          local.get 1
          i32.load offset=16
          call_indirect (type 1)
          local.get 6
          local.get 6
          i64.load
          i64.store offset=12 align=4
          local.get 6
          i32.const 12
          i32.add
          local.set 1
          global.get 0
          i32.const 112
          i32.sub
          local.tee 0
          global.set 0
          local.get 0
          i32.const 0
          i32.store offset=60
          local.get 0
          i64.const 4294967296
          i64.store offset=52 align=4
          block  ;; label = @4
            block  ;; label = @5
              local.get 0
              i32.const 52
              i32.add
              i32.const 1049316
              i32.const 12
              call 56
              br_if 0 (;@5;)
              local.get 1
              i32.load offset=12
              local.set 2
              local.get 0
              i32.const 3
              i32.store offset=68
              local.get 0
              i32.const 1049292
              i32.store offset=64
              local.get 0
              i64.const 3
              i64.store offset=76 align=4
              local.get 0
              local.get 2
              i64.extend_i32_u
              i64.const 12884901888
              i64.or
              i64.store offset=88
              local.get 0
              local.get 2
              i32.const 12
              i32.add
              i64.extend_i32_u
              i64.const 17179869184
              i64.or
              i64.store offset=104
              local.get 0
              local.get 2
              i32.const 8
              i32.add
              i64.extend_i32_u
              i64.const 17179869184
              i64.or
              i64.store offset=96
              local.get 0
              local.get 0
              i32.const 88
              i32.add
              i32.store offset=72
              local.get 0
              i32.const 52
              i32.add
              i32.const 1049040
              local.get 0
              i32.const -64
              i32.sub
              call 8
              br_if 0 (;@5;)
              local.get 0
              i32.const 52
              i32.add
              i32.const 1049245
              i32.const 1
              call 56
              br_if 0 (;@5;)
              block  ;; label = @6
                local.get 1
                i32.load offset=8
                local.tee 2
                if  ;; label = @7
                  local.get 0
                  i32.const 52
                  i32.add
                  i32.const 1049328
                  i32.const 1
                  call 56
                  br_if 2 (;@5;)
                  local.get 0
                  i32.const 104
                  i32.add
                  local.get 2
                  i32.const 16
                  i32.add
                  i64.load align=4
                  i64.store
                  local.get 0
                  i32.const 96
                  i32.add
                  local.get 2
                  i32.const 8
                  i32.add
                  i64.load align=4
                  i64.store
                  local.get 0
                  local.get 2
                  i64.load align=4
                  i64.store offset=88
                  local.get 0
                  i32.const 52
                  i32.add
                  i32.const 1049040
                  local.get 0
                  i32.const 88
                  i32.add
                  call 8
                  i32.eqz
                  br_if 1 (;@6;)
                  br 2 (;@5;)
                end
                local.get 0
                i32.const 24
                i32.add
                local.get 1
                i32.load
                local.tee 2
                local.get 1
                i32.load offset=4
                i32.const 12
                i32.add
                i32.load
                call_indirect (type 1)
                local.get 0
                i64.load offset=24
                i64.const -5076933981314334344
                i64.ne
                br_if 0 (;@6;)
                local.get 0
                i64.load offset=32
                i64.const 7199936582794304877
                i64.ne
                br_if 0 (;@6;)
                local.get 0
                i32.const 52
                i32.add
                i32.const 1049328
                i32.const 1
                call 56
                br_if 1 (;@5;)
                local.get 0
                i32.const 52
                i32.add
                local.get 2
                i32.load
                local.get 2
                i32.load offset=4
                call 56
                br_if 1 (;@5;)
              end
              local.get 0
              i32.const 48
              i32.add
              local.get 0
              i32.const 60
              i32.add
              i32.load
              i32.store
              local.get 0
              local.get 0
              i64.load offset=52 align=4
              i64.store offset=40
              local.get 0
              i32.const 40
              i32.add
              local.tee 1
              i32.const 1049233
              i32.const 1049243
              call 27
              local.get 0
              i32.const 16
              i32.add
              call 0
              local.tee 2
              call 1
              local.get 0
              i32.const 8
              i32.add
              local.get 0
              i32.load offset=16
              local.get 0
              i32.load offset=20
              call 32
              local.get 0
              local.get 0
              i32.load offset=12
              local.tee 3
              i32.store offset=96
              local.get 0
              local.get 0
              i32.load offset=8
              local.tee 5
              i32.store offset=92
              local.get 0
              local.get 3
              i32.store offset=88
              local.get 1
              local.get 5
              local.get 3
              call 50
              local.get 1
              i32.const 1049243
              i32.const 1049245
              call 27
              local.get 0
              local.get 1
              call 28
              local.get 0
              i32.load
              local.get 0
              i32.load offset=4
              call 2
              local.get 0
              i32.const 88
              i32.add
              call 41
              local.get 2
              i32.const 132
              i32.ge_u
              if  ;; label = @6
                local.get 2
                call 3
              end
              local.get 0
              i32.const 112
              i32.add
              global.set 0
              br 1 (;@4;)
            end
            i32.const 1049064
            i32.const 55
            local.get 0
            i32.const 88
            i32.add
            i32.const 1049120
            i32.const 1049212
            call 26
            unreachable
          end
          i32.const 1049956
          i32.load
          i32.const 1
          i32.sub
        else
          local.get 2
        end
        i32.store
        i32.const 1050424
        i32.const 0
        i32.store8
        local.get 4
        br_if 1 (;@1;)
      end
      unreachable
    end
    unreachable)
  (func (;23;) (type 6) (param i32 i32 i32 i32)
    block  ;; label = @1
      local.get 1
      if  ;; label = @2
        local.get 2
        i32.const 0
        i32.lt_s
        br_if 1 (;@1;)
        block (result i32)  ;; label = @3
          local.get 3
          i32.load offset=4
          if  ;; label = @4
            block  ;; label = @5
              local.get 3
              i32.load offset=8
              local.tee 1
              i32.eqz
              if  ;; label = @6
                br 1 (;@5;)
              end
              local.get 3
              i32.load
              local.get 1
              i32.const 1
              local.get 2
              call 5
              br 2 (;@3;)
            end
          end
          i32.const 1050425
          i32.load8_u
          drop
          local.get 2
          call 4
        end
        local.tee 1
        if  ;; label = @3
          local.get 0
          local.get 2
          i32.store offset=8
          local.get 0
          local.get 1
          i32.store offset=4
          local.get 0
          i32.const 0
          i32.store
          return
        end
        local.get 0
        local.get 2
        i32.store offset=8
        local.get 0
        i32.const 1
        i32.store offset=4
        local.get 0
        i32.const 1
        i32.store
        return
      end
      local.get 0
      i32.const 0
      i32.store offset=4
      local.get 0
      i32.const 1
      i32.store
      return
    end
    local.get 0
    i32.const 0
    i32.store offset=4
    local.get 0
    i32.const 1
    i32.store)
  (func (;24;) (type 6) (param i32 i32 i32 i32)
    (local i32 i32 i32)
    i32.const 1
    local.set 4
    i32.const 4
    local.set 6
    local.get 1
    i32.eqz
    local.get 2
    i32.const 0
    i32.lt_s
    i32.or
    i32.eqz
    if  ;; label = @1
      block (result i32)  ;; label = @2
        block (result i32)  ;; label = @3
          local.get 3
          i32.load offset=4
          if  ;; label = @4
            block  ;; label = @5
              local.get 3
              i32.load offset=8
              local.tee 1
              i32.eqz
              if  ;; label = @6
                br 1 (;@5;)
              end
              local.get 3
              i32.load
              local.get 1
              i32.const 1
              local.get 2
              call 5
              br 2 (;@3;)
            end
          end
          i32.const 1050425
          i32.load8_u
          drop
          local.get 2
          call 4
        end
        local.tee 4
        if  ;; label = @3
          local.get 0
          local.get 4
          i32.store offset=4
          i32.const 0
          br 1 (;@2;)
        end
        local.get 0
        i32.const 1
        i32.store offset=4
        i32.const 1
      end
      local.set 4
      i32.const 8
      local.set 6
      local.get 2
      local.set 5
    end
    local.get 0
    local.get 6
    i32.add
    local.get 5
    i32.store
    local.get 0
    local.get 4
    i32.store)
  (func (;25;) (type 1) (param i32 i32)
    (local i32 i32 i32 i64)
    global.get 0
    i32.const 32
    i32.sub
    local.tee 2
    global.set 0
    local.get 1
    i32.load
    i32.const -2147483648
    i32.eq
    if  ;; label = @1
      local.get 1
      i32.load offset=12
      local.set 3
      local.get 2
      i32.const 28
      i32.add
      local.tee 4
      i32.const 0
      i32.store
      local.get 2
      i64.const 4294967296
      i64.store offset=20 align=4
      local.get 2
      i32.const 20
      i32.add
      i32.const 1049568
      local.get 3
      call 8
      drop
      local.get 2
      i32.const 16
      i32.add
      local.get 4
      i32.load
      local.tee 3
      i32.store
      local.get 2
      local.get 2
      i64.load offset=20 align=4
      local.tee 5
      i64.store offset=8
      local.get 1
      i32.const 8
      i32.add
      local.get 3
      i32.store
      local.get 1
      local.get 5
      i64.store align=4
    end
    local.get 0
    i32.const 1049880
    i32.store offset=4
    local.get 0
    local.get 1
    i32.store
    local.get 2
    i32.const 32
    i32.add
    global.set 0)
  (func (;26;) (type 11) (param i32 i32 i32 i32 i32)
    (local i32)
    global.get 0
    i32.const -64
    i32.add
    local.tee 5
    global.set 0
    local.get 5
    local.get 1
    i32.store offset=12
    local.get 5
    local.get 0
    i32.store offset=8
    local.get 5
    local.get 3
    i32.store offset=20
    local.get 5
    local.get 2
    i32.store offset=16
    local.get 5
    i32.const 2
    i32.store offset=28
    local.get 5
    i32.const 1049352
    i32.store offset=24
    local.get 5
    i64.const 2
    i64.store offset=36 align=4
    local.get 5
    local.get 5
    i32.const 16
    i32.add
    i64.extend_i32_u
    i64.const 8589934592
    i64.or
    i64.store offset=56
    local.get 5
    local.get 5
    i32.const 8
    i32.add
    i64.extend_i32_u
    i64.const 12884901888
    i64.or
    i64.store offset=48
    local.get 5
    local.get 5
    i32.const 48
    i32.add
    i32.store offset=32
    local.get 5
    i32.const 24
    i32.add
    local.get 4
    call 36
    unreachable)
  (func (;27;) (type 3) (param i32 i32 i32)
    (local i32 i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 3
    global.set 0
    block  ;; label = @1
      local.get 2
      local.get 1
      i32.sub
      local.tee 4
      local.get 0
      i32.load
      local.get 0
      i32.load offset=8
      local.tee 2
      i32.sub
      i32.gt_u
      if  ;; label = @2
        local.get 3
        i32.const 8
        i32.add
        local.get 0
        local.get 2
        local.get 4
        call 18
        local.get 3
        i32.load offset=8
        local.tee 2
        i32.const -2147483647
        i32.ne
        br_if 1 (;@1;)
        local.get 0
        i32.load offset=8
        local.set 2
      end
      local.get 0
      i32.load offset=4
      local.get 2
      i32.add
      local.get 1
      local.get 4
      call 60
      drop
      local.get 0
      local.get 2
      local.get 4
      i32.add
      i32.store offset=8
      local.get 3
      i32.const 16
      i32.add
      global.set 0
      return
    end
    local.get 2
    local.get 3
    i32.load offset=12
    call 49
    unreachable)
  (func (;28;) (type 1) (param i32 i32)
    (local i32 i32 i32 i32)
    block  ;; label = @1
      local.get 1
      i32.load
      local.tee 3
      local.get 1
      i32.load offset=8
      local.tee 2
      i32.gt_u
      if  ;; label = @2
        local.get 1
        i32.load offset=4
        local.set 4
        block  ;; label = @3
          local.get 2
          i32.eqz
          if  ;; label = @4
            i32.const 1
            local.set 5
            local.get 4
            local.get 3
            call 46
            br 1 (;@3;)
          end
          local.get 4
          local.get 3
          i32.const 1
          local.get 2
          call 5
          local.tee 5
          i32.eqz
          br_if 2 (;@1;)
        end
        local.get 1
        local.get 2
        i32.store
        local.get 1
        local.get 5
        i32.store offset=4
      end
      local.get 0
      local.get 2
      i32.store offset=4
      local.get 0
      local.get 1
      i32.load offset=4
      i32.store
      return
    end
    i32.const 1
    local.get 2
    call 49
    unreachable)
  (func (;29;) (type 1) (param i32 i32)
    (local i32 i32)
    block  ;; label = @1
      local.get 0
      i32.const 4
      i32.sub
      i32.load
      local.tee 2
      i32.const -8
      i32.and
      local.tee 3
      i32.const 4
      i32.const 8
      local.get 2
      i32.const 3
      i32.and
      local.tee 2
      select
      local.get 1
      i32.add
      i32.ge_u
      if  ;; label = @2
        local.get 2
        i32.const 0
        local.get 3
        local.get 1
        i32.const 39
        i32.add
        i32.gt_u
        select
        br_if 1 (;@1;)
        local.get 0
        call 7
        return
      end
      i32.const 1049633
      i32.const 46
      i32.const 1049680
      call 33
      unreachable
    end
    i32.const 1049696
    i32.const 46
    i32.const 1049744
    call 33
    unreachable)
  (func (;30;) (type 2) (param i32 i32 i32) (result i32)
    (local i32)
    local.get 2
    local.get 0
    i32.load
    local.get 0
    i32.load offset=8
    local.tee 3
    i32.sub
    i32.gt_u
    if  ;; label = @1
      local.get 0
      local.get 3
      local.get 2
      call 20
      local.get 0
      i32.load offset=8
      local.set 3
    end
    local.get 0
    i32.load offset=4
    local.get 3
    i32.add
    local.get 1
    local.get 2
    call 60
    drop
    local.get 0
    local.get 2
    local.get 3
    i32.add
    i32.store offset=8
    i32.const 0)
  (func (;31;) (type 2) (param i32 i32 i32) (result i32)
    (local i32)
    local.get 2
    local.get 0
    i32.load
    local.get 0
    i32.load offset=8
    local.tee 3
    i32.sub
    i32.gt_u
    if  ;; label = @1
      local.get 0
      local.get 3
      local.get 2
      call 21
      local.get 0
      i32.load offset=8
      local.set 3
    end
    local.get 0
    i32.load offset=4
    local.get 3
    i32.add
    local.get 1
    local.get 2
    call 60
    drop
    local.get 0
    local.get 2
    local.get 3
    i32.add
    i32.store offset=8
    i32.const 0)
  (func (;32;) (type 3) (param i32 i32 i32)
    (local i32)
    global.get 0
    i32.const 32
    i32.sub
    local.tee 3
    global.set 0
    local.get 3
    local.get 2
    i32.store offset=28
    local.get 3
    local.get 1
    i32.store offset=24
    local.get 3
    local.get 2
    i32.store offset=20
    local.get 3
    i32.const 8
    i32.add
    local.get 3
    i32.const 20
    i32.add
    call 28
    local.get 0
    local.get 3
    i64.load offset=8
    i64.store
    local.get 3
    i32.const 32
    i32.add
    global.set 0)
  (func (;33;) (type 3) (param i32 i32 i32)
    (local i32)
    global.get 0
    i32.const 32
    i32.sub
    local.tee 3
    global.set 0
    local.get 3
    i32.const 0
    i32.store offset=16
    local.get 3
    i32.const 1
    i32.store offset=4
    local.get 3
    i64.const 4
    i64.store offset=8 align=4
    local.get 3
    local.get 1
    i32.store offset=28
    local.get 3
    local.get 0
    i32.store offset=24
    local.get 3
    local.get 3
    i32.const 24
    i32.add
    i32.store
    local.get 3
    local.get 2
    call 36
    unreachable)
  (func (;34;) (type 5) (param i32 i32 i32 i32) (result i32)
    block  ;; label = @1
      block (result i32)  ;; label = @2
        local.get 2
        i32.const 1114112
        i32.ne
        if  ;; label = @3
          i32.const 1
          local.get 0
          local.get 2
          local.get 1
          i32.load offset=16
          call_indirect (type 0)
          br_if 1 (;@2;)
          drop
        end
        local.get 3
        br_if 1 (;@1;)
        i32.const 0
      end
      return
    end
    local.get 0
    local.get 3
    i32.const 0
    local.get 1
    i32.load offset=12
    call_indirect (type 2))
  (func (;35;) (type 1) (param i32 i32)
    (local i32 i32)
    i32.const 1050425
    i32.load8_u
    drop
    local.get 1
    i32.load offset=4
    local.set 2
    local.get 1
    i32.load
    local.set 3
    i32.const 8
    call 4
    local.tee 1
    i32.eqz
    if  ;; label = @1
      unreachable
    end
    local.get 1
    local.get 2
    i32.store offset=4
    local.get 1
    local.get 3
    i32.store
    local.get 0
    i32.const 1049896
    i32.store offset=4
    local.get 0
    local.get 1
    i32.store)
  (func (;36;) (type 1) (param i32 i32)
    (local i32 i32)
    global.get 0
    i32.const 32
    i32.sub
    local.tee 2
    global.set 0
    local.get 2
    i32.const 1
    i32.store16 offset=28
    local.get 2
    local.get 1
    i32.store offset=24
    local.get 2
    local.get 0
    i32.store offset=20
    local.get 2
    i32.const 1049332
    i32.store offset=16
    local.get 2
    i32.const 1
    i32.store offset=12
    global.get 0
    i32.const 16
    i32.sub
    local.tee 1
    global.set 0
    local.get 2
    i32.const 12
    i32.add
    local.tee 0
    i32.load offset=8
    local.tee 2
    i32.eqz
    if  ;; label = @1
      i32.const 1049246
      i32.const 43
      i32.const 1049864
      call 33
      unreachable
    end
    local.get 1
    local.get 0
    i32.load offset=12
    i32.store offset=12
    local.get 1
    local.get 0
    i32.store offset=8
    local.get 1
    local.get 2
    i32.store offset=4
    global.get 0
    i32.const 16
    i32.sub
    local.tee 0
    global.set 0
    local.get 1
    i32.const 4
    i32.add
    local.tee 1
    i32.load
    local.tee 2
    i32.load offset=12
    local.set 3
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            local.get 2
            i32.load offset=4
            br_table 0 (;@4;) 1 (;@3;) 2 (;@2;)
          end
          local.get 3
          br_if 1 (;@2;)
          i32.const 1
          local.set 2
          i32.const 0
          local.set 3
          br 2 (;@1;)
        end
        local.get 3
        br_if 0 (;@2;)
        local.get 2
        i32.load
        local.tee 2
        i32.load offset=4
        local.set 3
        local.get 2
        i32.load
        local.set 2
        br 1 (;@1;)
      end
      local.get 0
      local.get 2
      i32.store offset=12
      local.get 0
      i32.const -2147483648
      i32.store
      local.get 0
      i32.const 1049932
      local.get 1
      i32.load offset=4
      local.tee 0
      i32.load offset=8
      local.get 1
      i32.load offset=8
      local.get 0
      i32.load8_u offset=16
      local.get 0
      i32.load8_u offset=17
      call 22
      unreachable
    end
    local.get 0
    local.get 3
    i32.store offset=4
    local.get 0
    local.get 2
    i32.store
    local.get 0
    i32.const 1049912
    local.get 1
    i32.load offset=4
    local.tee 0
    i32.load offset=8
    local.get 1
    i32.load offset=8
    local.get 0
    i32.load8_u offset=16
    local.get 0
    i32.load8_u offset=17
    call 22
    unreachable)
  (func (;37;) (type 0) (param i32 i32) (result i32)
    block  ;; label = @1
      local.get 1
      i32.popcnt
      i32.const 1
      i32.ne
      i32.const -2147483648
      local.get 1
      i32.sub
      local.get 0
      i32.lt_u
      i32.or
      br_if 0 (;@1;)
      local.get 0
      if  ;; label = @2
        local.get 1
        local.get 0
        call 55
        local.tee 1
        i32.eqz
        br_if 1 (;@1;)
      end
      local.get 1
      return
    end
    unreachable)
  (func (;38;) (type 5) (param i32 i32 i32 i32) (result i32)
    block  ;; label = @1
      local.get 3
      i32.popcnt
      i32.const 1
      i32.ne
      i32.const -2147483648
      local.get 3
      i32.sub
      local.get 1
      i32.lt_u
      i32.or
      i32.eqz
      if  ;; label = @2
        local.get 0
        local.get 1
        local.get 3
        local.get 2
        call 5
        local.tee 0
        br_if 1 (;@1;)
      end
      unreachable
    end
    local.get 0)
  (func (;39;) (type 3) (param i32 i32 i32)
    local.get 2
    if  ;; label = @1
      local.get 1
      local.get 2
      call 55
      local.set 1
    end
    local.get 0
    local.get 2
    i32.store offset=4
    local.get 0
    local.get 1
    i32.store)
  (func (;40;) (type 4) (param i32)
    (local i32)
    local.get 0
    i32.load
    local.tee 1
    i32.const -2147483648
    i32.or
    i32.const -2147483648
    i32.ne
    if  ;; label = @1
      local.get 0
      i32.load offset=4
      local.get 1
      call 29
    end)
  (func (;41;) (type 4) (param i32)
    (local i32)
    local.get 0
    i32.load
    local.tee 1
    if  ;; label = @1
      local.get 0
      i32.load offset=4
      local.get 1
      call 46
    end)
  (func (;42;) (type 4) (param i32)
    (local i32)
    local.get 0
    i32.load
    local.tee 1
    if  ;; label = @1
      local.get 0
      i32.load offset=4
      local.get 1
      call 29
    end)
  (func (;43;) (type 0) (param i32 i32) (result i32)
    local.get 1
    i32.load offset=20
    i32.const 1049228
    i32.const 5
    local.get 1
    i32.load offset=24
    i32.load offset=12
    call_indirect (type 2))
  (func (;44;) (type 0) (param i32 i32) (result i32)
    local.get 1
    i32.load offset=4
    drop
    local.get 0
    i32.const 1049040
    local.get 1
    call 8)
  (func (;45;) (type 0) (param i32 i32) (result i32)
    local.get 0
    i32.load
    local.get 1
    local.get 0
    i32.load offset=4
    i32.load offset=12
    call_indirect (type 0))
  (func (;46;) (type 1) (param i32 i32)
    local.get 1
    if  ;; label = @1
      local.get 0
      local.get 1
      call 29
    end)
  (func (;47;) (type 3) (param i32 i32 i32)
    local.get 1
    if  ;; label = @1
      local.get 0
      local.get 1
      call 29
    end)
  (func (;48;) (type 0) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    block (result i32)  ;; label = @1
      local.get 0
      i32.load
      local.set 6
      local.get 0
      i32.load offset=4
      local.set 7
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            local.get 1
            local.tee 9
            i32.load
            local.tee 3
            local.get 1
            i32.load offset=8
            local.tee 0
            i32.or
            if  ;; label = @5
              block  ;; label = @6
                local.get 0
                i32.eqz
                br_if 0 (;@6;)
                local.get 6
                local.get 7
                i32.add
                local.set 4
                block  ;; label = @7
                  local.get 9
                  i32.load offset=12
                  local.tee 8
                  i32.eqz
                  if  ;; label = @8
                    local.get 6
                    local.set 0
                    br 1 (;@7;)
                  end
                  local.get 6
                  local.set 0
                  loop  ;; label = @8
                    local.get 0
                    local.tee 1
                    local.get 4
                    i32.eq
                    br_if 2 (;@6;)
                    block (result i32)  ;; label = @9
                      local.get 1
                      i32.const 1
                      i32.add
                      local.get 1
                      i32.load8_s
                      local.tee 0
                      i32.const 0
                      i32.ge_s
                      br_if 0 (;@9;)
                      drop
                      local.get 1
                      i32.const 2
                      i32.add
                      local.get 0
                      i32.const -32
                      i32.lt_u
                      br_if 0 (;@9;)
                      drop
                      local.get 1
                      i32.const 3
                      i32.add
                      local.get 0
                      i32.const -16
                      i32.lt_u
                      br_if 0 (;@9;)
                      drop
                      local.get 0
                      i32.const 255
                      i32.and
                      i32.const 18
                      i32.shl
                      i32.const 1835008
                      i32.and
                      local.get 1
                      i32.load8_u offset=3
                      i32.const 63
                      i32.and
                      local.get 1
                      i32.load8_u offset=2
                      i32.const 63
                      i32.and
                      i32.const 6
                      i32.shl
                      local.get 1
                      i32.load8_u offset=1
                      i32.const 63
                      i32.and
                      i32.const 12
                      i32.shl
                      i32.or
                      i32.or
                      i32.or
                      i32.const 1114112
                      i32.eq
                      br_if 3 (;@6;)
                      local.get 1
                      i32.const 4
                      i32.add
                    end
                    local.tee 0
                    local.get 2
                    local.get 1
                    i32.sub
                    i32.add
                    local.set 2
                    local.get 8
                    local.get 5
                    i32.const 1
                    i32.add
                    local.tee 5
                    i32.ne
                    br_if 0 (;@8;)
                  end
                end
                local.get 0
                local.get 4
                i32.eq
                br_if 0 (;@6;)
                local.get 0
                i32.load8_s
                local.tee 1
                i32.const 0
                i32.ge_s
                local.get 1
                i32.const -32
                i32.lt_u
                i32.or
                local.get 1
                i32.const -16
                i32.lt_u
                i32.or
                i32.eqz
                if  ;; label = @7
                  local.get 1
                  i32.const 255
                  i32.and
                  i32.const 18
                  i32.shl
                  i32.const 1835008
                  i32.and
                  local.get 0
                  i32.load8_u offset=3
                  i32.const 63
                  i32.and
                  local.get 0
                  i32.load8_u offset=2
                  i32.const 63
                  i32.and
                  i32.const 6
                  i32.shl
                  local.get 0
                  i32.load8_u offset=1
                  i32.const 63
                  i32.and
                  i32.const 12
                  i32.shl
                  i32.or
                  i32.or
                  i32.or
                  i32.const 1114112
                  i32.eq
                  br_if 1 (;@6;)
                end
                block  ;; label = @7
                  local.get 2
                  i32.eqz
                  br_if 0 (;@7;)
                  local.get 2
                  local.get 7
                  i32.ge_u
                  if  ;; label = @8
                    local.get 2
                    local.get 7
                    i32.eq
                    br_if 1 (;@7;)
                    br 2 (;@6;)
                  end
                  local.get 2
                  local.get 6
                  i32.add
                  i32.load8_s
                  i32.const -64
                  i32.lt_s
                  br_if 1 (;@6;)
                end
                local.get 2
                local.set 7
              end
              local.get 3
              i32.eqz
              br_if 3 (;@2;)
              local.get 9
              i32.load offset=4
              local.set 11
              local.get 7
              i32.const 16
              i32.ge_u
              if  ;; label = @6
                local.get 7
                local.get 6
                local.get 6
                i32.const 3
                i32.add
                i32.const -4
                i32.and
                local.tee 2
                i32.sub
                local.tee 5
                i32.add
                local.tee 10
                i32.const 3
                i32.and
                local.set 8
                i32.const 0
                local.set 3
                i32.const 0
                local.set 1
                local.get 2
                local.get 6
                i32.ne
                if  ;; label = @7
                  local.get 5
                  i32.const -4
                  i32.le_u
                  if  ;; label = @8
                    i32.const 0
                    local.set 4
                    loop  ;; label = @9
                      local.get 1
                      local.get 4
                      local.get 6
                      i32.add
                      local.tee 0
                      i32.load8_s
                      i32.const -65
                      i32.gt_s
                      i32.add
                      local.get 0
                      i32.const 1
                      i32.add
                      i32.load8_s
                      i32.const -65
                      i32.gt_s
                      i32.add
                      local.get 0
                      i32.const 2
                      i32.add
                      i32.load8_s
                      i32.const -65
                      i32.gt_s
                      i32.add
                      local.get 0
                      i32.const 3
                      i32.add
                      i32.load8_s
                      i32.const -65
                      i32.gt_s
                      i32.add
                      local.set 1
                      local.get 4
                      i32.const 4
                      i32.add
                      local.tee 4
                      br_if 0 (;@9;)
                    end
                  end
                  local.get 6
                  local.set 0
                  loop  ;; label = @8
                    local.get 1
                    local.get 0
                    i32.load8_s
                    i32.const -65
                    i32.gt_s
                    i32.add
                    local.set 1
                    local.get 0
                    i32.const 1
                    i32.add
                    local.set 0
                    local.get 5
                    i32.const 1
                    i32.add
                    local.tee 5
                    br_if 0 (;@8;)
                  end
                end
                block  ;; label = @7
                  local.get 8
                  i32.eqz
                  br_if 0 (;@7;)
                  local.get 2
                  local.get 10
                  i32.const -4
                  i32.and
                  i32.add
                  local.tee 0
                  i32.load8_s
                  i32.const -65
                  i32.gt_s
                  local.set 3
                  local.get 8
                  i32.const 1
                  i32.eq
                  br_if 0 (;@7;)
                  local.get 3
                  local.get 0
                  i32.load8_s offset=1
                  i32.const -65
                  i32.gt_s
                  i32.add
                  local.set 3
                  local.get 8
                  i32.const 2
                  i32.eq
                  br_if 0 (;@7;)
                  local.get 3
                  local.get 0
                  i32.load8_s offset=2
                  i32.const -65
                  i32.gt_s
                  i32.add
                  local.set 3
                end
                local.get 10
                i32.const 2
                i32.shr_u
                local.set 4
                local.get 1
                local.get 3
                i32.add
                local.set 3
                loop  ;; label = @7
                  local.get 2
                  local.set 5
                  local.get 4
                  i32.eqz
                  br_if 4 (;@3;)
                  i32.const 192
                  local.get 4
                  local.get 4
                  i32.const 192
                  i32.ge_u
                  select
                  local.tee 8
                  i32.const 3
                  i32.and
                  local.set 10
                  local.get 8
                  i32.const 2
                  i32.shl
                  local.set 2
                  i32.const 0
                  local.set 0
                  local.get 4
                  i32.const 4
                  i32.ge_u
                  if  ;; label = @8
                    local.get 5
                    local.get 2
                    i32.const 1008
                    i32.and
                    i32.add
                    local.set 12
                    local.get 5
                    local.set 1
                    loop  ;; label = @9
                      local.get 0
                      local.get 1
                      i32.load
                      local.tee 13
                      i32.const -1
                      i32.xor
                      i32.const 7
                      i32.shr_u
                      local.get 13
                      i32.const 6
                      i32.shr_u
                      i32.or
                      i32.const 16843009
                      i32.and
                      i32.add
                      local.get 1
                      i32.load offset=4
                      local.tee 0
                      i32.const -1
                      i32.xor
                      i32.const 7
                      i32.shr_u
                      local.get 0
                      i32.const 6
                      i32.shr_u
                      i32.or
                      i32.const 16843009
                      i32.and
                      i32.add
                      local.get 1
                      i32.load offset=8
                      local.tee 0
                      i32.const -1
                      i32.xor
                      i32.const 7
                      i32.shr_u
                      local.get 0
                      i32.const 6
                      i32.shr_u
                      i32.or
                      i32.const 16843009
                      i32.and
                      i32.add
                      local.get 1
                      i32.load offset=12
                      local.tee 0
                      i32.const -1
                      i32.xor
                      i32.const 7
                      i32.shr_u
                      local.get 0
                      i32.const 6
                      i32.shr_u
                      i32.or
                      i32.const 16843009
                      i32.and
                      i32.add
                      local.set 0
                      local.get 1
                      i32.const 16
                      i32.add
                      local.tee 1
                      local.get 12
                      i32.ne
                      br_if 0 (;@9;)
                    end
                  end
                  local.get 4
                  local.get 8
                  i32.sub
                  local.set 4
                  local.get 2
                  local.get 5
                  i32.add
                  local.set 2
                  local.get 0
                  i32.const 8
                  i32.shr_u
                  i32.const 16711935
                  i32.and
                  local.get 0
                  i32.const 16711935
                  i32.and
                  i32.add
                  i32.const 65537
                  i32.mul
                  i32.const 16
                  i32.shr_u
                  local.get 3
                  i32.add
                  local.set 3
                  local.get 10
                  i32.eqz
                  br_if 0 (;@7;)
                end
                local.get 5
                local.get 8
                i32.const 252
                i32.and
                i32.const 2
                i32.shl
                i32.add
                local.tee 0
                i32.load
                local.tee 1
                i32.const -1
                i32.xor
                i32.const 7
                i32.shr_u
                local.get 1
                i32.const 6
                i32.shr_u
                i32.or
                i32.const 16843009
                i32.and
                local.set 1
                local.get 10
                i32.const 1
                i32.eq
                br_if 2 (;@4;)
                local.get 1
                local.get 0
                i32.load offset=4
                local.tee 2
                i32.const -1
                i32.xor
                i32.const 7
                i32.shr_u
                local.get 2
                i32.const 6
                i32.shr_u
                i32.or
                i32.const 16843009
                i32.and
                i32.add
                local.set 1
                local.get 10
                i32.const 2
                i32.eq
                br_if 2 (;@4;)
                local.get 1
                local.get 0
                i32.load offset=8
                local.tee 0
                i32.const -1
                i32.xor
                i32.const 7
                i32.shr_u
                local.get 0
                i32.const 6
                i32.shr_u
                i32.or
                i32.const 16843009
                i32.and
                i32.add
                local.set 1
                br 2 (;@4;)
              end
              local.get 7
              i32.eqz
              if  ;; label = @6
                i32.const 0
                local.set 3
                br 3 (;@3;)
              end
              local.get 7
              i32.const 3
              i32.and
              local.set 0
              block  ;; label = @6
                local.get 7
                i32.const 4
                i32.lt_u
                if  ;; label = @7
                  i32.const 0
                  local.set 3
                  i32.const 0
                  local.set 5
                  br 1 (;@6;)
                end
                i32.const 0
                local.set 3
                local.get 6
                local.set 1
                local.get 7
                i32.const 12
                i32.and
                local.tee 5
                local.set 2
                loop  ;; label = @7
                  local.get 3
                  local.get 1
                  i32.load8_s
                  i32.const -65
                  i32.gt_s
                  i32.add
                  local.get 1
                  i32.const 1
                  i32.add
                  i32.load8_s
                  i32.const -65
                  i32.gt_s
                  i32.add
                  local.get 1
                  i32.const 2
                  i32.add
                  i32.load8_s
                  i32.const -65
                  i32.gt_s
                  i32.add
                  local.get 1
                  i32.const 3
                  i32.add
                  i32.load8_s
                  i32.const -65
                  i32.gt_s
                  i32.add
                  local.set 3
                  local.get 1
                  i32.const 4
                  i32.add
                  local.set 1
                  local.get 2
                  i32.const 4
                  i32.sub
                  local.tee 2
                  br_if 0 (;@7;)
                end
              end
              local.get 0
              i32.eqz
              br_if 2 (;@3;)
              local.get 5
              local.get 6
              i32.add
              local.set 1
              loop  ;; label = @6
                local.get 3
                local.get 1
                i32.load8_s
                i32.const -65
                i32.gt_s
                i32.add
                local.set 3
                local.get 1
                i32.const 1
                i32.add
                local.set 1
                local.get 0
                i32.const 1
                i32.sub
                local.tee 0
                br_if 0 (;@6;)
              end
              br 2 (;@3;)
            end
            br 2 (;@2;)
          end
          local.get 1
          i32.const 8
          i32.shr_u
          i32.const 459007
          i32.and
          local.get 1
          i32.const 16711935
          i32.and
          i32.add
          i32.const 65537
          i32.mul
          i32.const 16
          i32.shr_u
          local.get 3
          i32.add
          local.set 3
        end
        block  ;; label = @3
          local.get 3
          local.get 11
          i32.lt_u
          if  ;; label = @4
            local.get 11
            local.get 3
            i32.sub
            local.set 4
            i32.const 0
            local.set 1
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  local.get 9
                  i32.load8_u offset=32
                  i32.const 1
                  i32.sub
                  br_table 0 (;@7;) 1 (;@6;) 2 (;@5;)
                end
                local.get 4
                local.set 1
                i32.const 0
                local.set 4
                br 1 (;@5;)
              end
              local.get 4
              i32.const 1
              i32.shr_u
              local.set 1
              local.get 4
              i32.const 1
              i32.add
              i32.const 1
              i32.shr_u
              local.set 4
            end
            local.get 1
            i32.const 1
            i32.add
            local.set 1
            local.get 9
            i32.load offset=16
            local.set 5
            local.get 9
            i32.load offset=24
            local.set 0
            local.get 9
            i32.load offset=20
            local.set 2
            loop  ;; label = @5
              local.get 1
              i32.const 1
              i32.sub
              local.tee 1
              i32.eqz
              br_if 2 (;@3;)
              local.get 2
              local.get 5
              local.get 0
              i32.load offset=16
              call_indirect (type 0)
              i32.eqz
              br_if 0 (;@5;)
            end
            i32.const 1
            br 3 (;@1;)
          end
          br 1 (;@2;)
        end
        local.get 2
        local.get 6
        local.get 7
        local.get 0
        i32.load offset=12
        call_indirect (type 2)
        if (result i32)  ;; label = @3
          i32.const 1
        else
          i32.const 0
          local.set 1
          block (result i32)  ;; label = @4
            loop  ;; label = @5
              local.get 4
              local.get 1
              local.get 4
              i32.eq
              br_if 1 (;@4;)
              drop
              local.get 1
              i32.const 1
              i32.add
              local.set 1
              local.get 2
              local.get 5
              local.get 0
              i32.load offset=16
              call_indirect (type 0)
              i32.eqz
              br_if 0 (;@5;)
            end
            local.get 1
            i32.const 1
            i32.sub
          end
          local.get 4
          i32.lt_u
        end
        br 1 (;@1;)
      end
      local.get 9
      i32.load offset=20
      local.get 6
      local.get 7
      local.get 9
      i32.load offset=24
      i32.load offset=12
      call_indirect (type 2)
    end)
  (func (;49;) (type 1) (param i32 i32)
    local.get 0
    i32.eqz
    if  ;; label = @1
      global.get 0
      i32.const 32
      i32.sub
      local.tee 0
      global.set 0
      local.get 0
      i32.const 0
      i32.store offset=24
      local.get 0
      i32.const 1
      i32.store offset=12
      local.get 0
      i32.const 1048880
      i32.store offset=8
      local.get 0
      i64.const 4
      i64.store offset=16 align=4
      local.get 0
      i32.const 8
      i32.add
      i32.const 1048916
      call 36
      unreachable
    end
    unreachable)
  (func (;50;) (type 3) (param i32 i32 i32)
    local.get 0
    local.get 1
    local.get 1
    local.get 2
    i32.add
    call 27)
  (func (;51;) (type 1) (param i32 i32)
    local.get 0
    i64.const 9172487606043731407
    i64.store offset=8
    local.get 0
    i64.const -8877450274954529964
    i64.store)
  (func (;52;) (type 1) (param i32 i32)
    local.get 0
    i32.const 1049896
    i32.store offset=4
    local.get 0
    local.get 1
    i32.store)
  (func (;53;) (type 1) (param i32 i32)
    local.get 0
    i64.const 7199936582794304877
    i64.store offset=8
    local.get 0
    i64.const -5076933981314334344
    i64.store)
  (func (;54;) (type 1) (param i32 i32)
    local.get 0
    i64.const -2989668174502565848
    i64.store offset=8
    local.get 0
    i64.const -8255713724082750831
    i64.store)
  (func (;55;) (type 0) (param i32 i32) (result i32)
    i32.const 1050425
    i32.load8_u
    drop
    block (result i32)  ;; label = @1
      local.get 0
      i32.const 9
      i32.ge_u
      if  ;; label = @2
        local.get 0
        local.get 1
        call 10
        br 1 (;@1;)
      end
      local.get 1
      call 4
    end)
  (func (;56;) (type 2) (param i32 i32 i32) (result i32)
    local.get 0
    local.get 1
    local.get 2
    call 50
    i32.const 0)
  (func (;57;) (type 7) (param i32) (result i32)
    local.get 0
    global.get 0
    i32.add
    global.set 0
    global.get 0)
  (func (;58;) (type 0) (param i32 i32) (result i32)
    local.get 0
    i32.const 1048836
    local.get 1
    call 8)
  (func (;59;) (type 0) (param i32 i32) (result i32)
    local.get 0
    i32.const 1049568
    local.get 1
    call 8)
  (func (;60;) (type 2) (param i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32)
    block  ;; label = @1
      local.get 2
      local.tee 4
      i32.const 16
      i32.lt_u
      if  ;; label = @2
        local.get 0
        local.set 2
        br 1 (;@1;)
      end
      local.get 0
      i32.const 0
      local.get 0
      i32.sub
      i32.const 3
      i32.and
      local.tee 3
      i32.add
      local.set 5
      local.get 3
      if  ;; label = @2
        local.get 0
        local.set 2
        local.get 1
        local.set 6
        loop  ;; label = @3
          local.get 2
          local.get 6
          i32.load8_u
          i32.store8
          local.get 6
          i32.const 1
          i32.add
          local.set 6
          local.get 2
          i32.const 1
          i32.add
          local.tee 2
          local.get 5
          i32.lt_u
          br_if 0 (;@3;)
        end
      end
      local.get 5
      local.get 4
      local.get 3
      i32.sub
      local.tee 8
      i32.const -4
      i32.and
      local.tee 7
      i32.add
      local.set 2
      block  ;; label = @2
        local.get 1
        local.get 3
        i32.add
        local.tee 3
        i32.const 3
        i32.and
        if  ;; label = @3
          local.get 7
          i32.const 0
          i32.le_s
          br_if 1 (;@2;)
          local.get 3
          i32.const 3
          i32.shl
          local.tee 4
          i32.const 24
          i32.and
          local.set 9
          local.get 3
          i32.const -4
          i32.and
          local.tee 6
          i32.const 4
          i32.add
          local.set 1
          i32.const 0
          local.get 4
          i32.sub
          i32.const 24
          i32.and
          local.set 4
          local.get 6
          i32.load
          local.set 6
          loop  ;; label = @4
            local.get 5
            local.get 6
            local.get 9
            i32.shr_u
            local.get 1
            i32.load
            local.tee 6
            local.get 4
            i32.shl
            i32.or
            i32.store
            local.get 1
            i32.const 4
            i32.add
            local.set 1
            local.get 5
            i32.const 4
            i32.add
            local.tee 5
            local.get 2
            i32.lt_u
            br_if 0 (;@4;)
          end
          br 1 (;@2;)
        end
        local.get 7
        i32.const 0
        i32.le_s
        br_if 0 (;@2;)
        local.get 3
        local.set 1
        loop  ;; label = @3
          local.get 5
          local.get 1
          i32.load
          i32.store
          local.get 1
          i32.const 4
          i32.add
          local.set 1
          local.get 5
          i32.const 4
          i32.add
          local.tee 5
          local.get 2
          i32.lt_u
          br_if 0 (;@3;)
        end
      end
      local.get 8
      i32.const 3
      i32.and
      local.set 4
      local.get 3
      local.get 7
      i32.add
      local.set 1
    end
    local.get 4
    if  ;; label = @1
      local.get 2
      local.get 4
      i32.add
      local.set 3
      loop  ;; label = @2
        local.get 2
        local.get 1
        i32.load8_u
        i32.store8
        local.get 1
        i32.const 1
        i32.add
        local.set 1
        local.get 2
        i32.const 1
        i32.add
        local.tee 2
        local.get 3
        i32.lt_u
        br_if 0 (;@2;)
      end
    end
    local.get 0)
  (func (;61;) (type 4) (param i32)
    local.get 0
    call 41)
  (func (;62;) (type 4) (param i32)
    nop)
  (table (;0;) 30 30 funcref)
  (memory (;0;) 17)
  (global (;0;) (mut i32) (i32.const 1048576))
  (export "memory" (memory 0))
  (export "greeter" (func 14))
  (export "main" (func 19))
  (export "__wbindgen_add_to_stack_pointer" (func 57))
  (export "__wbindgen_export_0" (func 37))
  (export "__wbindgen_export_1" (func 38))
  (export "__wbindgen_export_2" (func 47))
  (export "__wbindgen_start" (func 19))
  (elem (;0;) (i32.const 1) func 48 45 48 6 42 30 12 58 62 43 61 56 16 44 62 43 51 42 31 13 59 54 62 53 35 52 40 17 25)
  (data (;0;) (i32.const 1048576) "/usr/local/cargo/registry/src/index.crates.io-6f17d22bba15001f/console_error_panic_hook-0.1.7/src/lib.rs\00\00\10\00h\00\00\00\95\00\00\00\0e\00\00\00Once instance has previously been poisoned\00\00x\00\10\00*\00\00\00one-time initialization may not be performed recursively\ac\00\10\008\00\00\00Hello !\00\ec\00\10\00\06\00\00\00\f2\00\10\00\01\00\00\00\05\00\00\00\0c\00\00\00\04\00\00\00\06\00\00\00\07\00\00\00\08\00\00\00capacity overflow\00\00\00\1c\01\10\00\11\00\00\00library/alloc/src/raw_vec.rs8\01\10\00\1c\00\00\00\19\00\00\00\05\00\00\00a formatting trait implementation returned an error\00\09\00\00\00\00\00\00\00\01\00\00\00\0a\00\00\00library/alloc/src/fmt.rs\a8\01\10\00\18\00\00\00y\02\00\00 \00\00\00\0b\00\00\00\0c\00\00\00\04\00\00\00\0c\00\00\00\0d\00\00\00\0e\00\00\00a Display implementation returned an error unexpectedly\00\0f\00\00\00\00\00\00\00\01\00\00\00\10\00\00\00/rustc/129f3b9964af4d4a709d1383930ade12dfe7c081/library/alloc/src/string.rs\000\02\10\00K\00\00\00\ff\09\00\00\0e\00\00\00Error\0a\0aStack:\0a\0a\0a\0a:called `Option::unwrap()` on a `None` value\00\00\00\01\00\00\00\00\00\00\00\9d\02\10\00\01\00\00\00\9d\02\10\00\01\00\00\00panicked at \0a\00\00\00\09\00\00\00\00\00\00\00\01\00\00\00\11\00\00\00: \00\00\01\00\00\00\00\00\00\00\04\03\10\00\02\00\00\0000010203040506070809101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899\12\00\00\00\0c\00\00\00\04\00\00\00\13\00\00\00\14\00\00\00\15\00\00\00/rust/deps/dlmalloc-0.2.6/src/dlmalloc.rsassertion failed: psize >= size + min_overhead\00\f8\03\10\00)\00\00\00\a8\04\00\00\09\00\00\00assertion failed: psize <= size + max_overhead\00\00\f8\03\10\00)\00\00\00\ae\04\00\00\0d\00\00\00cannot modify the panic hook from a panicking thread\a0\04\10\004\00\00\00library/std/src/panicking.rs\dc\04\10\00\1c\00\00\00\86\00\00\00\09\00\00\00\dc\04\10\00\1c\00\00\00\8b\02\00\00\1e\00\00\00\12\00\00\00\0c\00\00\00\04\00\00\00\16\00\00\00\17\00\00\00\08\00\00\00\04\00\00\00\18\00\00\00\17\00\00\00\08\00\00\00\04\00\00\00\19\00\00\00\1a\00\00\00\1b\00\00\00\10\00\00\00\04\00\00\00\1c\00\00\00\1d"))
