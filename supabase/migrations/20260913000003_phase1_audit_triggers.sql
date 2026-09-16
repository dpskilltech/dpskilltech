-- =============================================================================
-- DP SKILL TECH ACADEMY — PHASE 1 AUDIT TRIGGERS
-- SECURITY DEFINER Functions for Immutable Audit Trail
-- These triggers log critical data mutations at the DB level regardless of
-- which application path triggered the change.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CORE AUDIT LOG WRITER (SECURITY DEFINER)
-- Called by all audit triggers below. Runs with elevated privileges so it can
-- INSERT into audit_logs even when no client INSERT RLS policy exists.
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION write_audit_log(
  p_actor_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id TEXT,
  p_previous_value JSONB,
  p_new_value JSONB
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO audit_logs (
    actor_user_id,
    action,
    entity_type,
    entity_id,
    previous_value,
    new_value,
    created_at
  ) VALUES (
    p_actor_user_id,
    p_action,
    p_entity_type,
    p_entity_id,
    p_previous_value,
    p_new_value,
    NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Revoke direct EXECUTE from public so only the trigger mechanism calls it
REVOKE EXECUTE ON FUNCTION write_audit_log(UUID, TEXT, TEXT, TEXT, JSONB, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION write_audit_log(UUID, TEXT, TEXT, TEXT, JSONB, JSONB) TO service_role;

-- -----------------------------------------------------------------------------
-- 2. PROFILES STATUS CHANGE TRIGGER
-- Logs when a user's account status changes (ACTIVE → SUSPENDED, etc.)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION audit_profiles_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM write_audit_log(
      auth.uid(),
      'PROFILE_STATUS_CHANGED',
      'profiles',
      NEW.id::TEXT,
      jsonb_build_object('status', OLD.status),
      jsonb_build_object('status', NEW.status)
    );
  END IF;

  IF NEW.requires_password_change IS DISTINCT FROM OLD.requires_password_change THEN
    PERFORM write_audit_log(
      auth.uid(),
      'PASSWORD_CHANGE_FLAG_UPDATED',
      'profiles',
      NEW.id::TEXT,
      jsonb_build_object('requires_password_change', OLD.requires_password_change),
      jsonb_build_object('requires_password_change', NEW.requires_password_change)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_audit_profiles_status
  AFTER UPDATE OF status, requires_password_change ON profiles
  FOR EACH ROW EXECUTE FUNCTION audit_profiles_status_change();

-- -----------------------------------------------------------------------------
-- 3. ENROLLMENT STATUS TRANSITION TRIGGER
-- Logs every enrollment status transition (INQUIRY → CONTACTED → ... → COMPLETED)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION audit_enrollment_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM write_audit_log(
      auth.uid(),
      'ENROLLMENT_STATUS_CHANGED',
      'enrollments',
      NEW.id::TEXT,
      jsonb_build_object(
        'status', OLD.status,
        'enrollment_code', OLD.enrollment_code
      ),
      jsonb_build_object(
        'status', NEW.status,
        'enrollment_code', NEW.enrollment_code
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_audit_enrollment_status
  AFTER UPDATE OF status ON enrollments
  FOR EACH ROW EXECUTE FUNCTION audit_enrollment_status_change();

-- -----------------------------------------------------------------------------
-- 4. CERTIFICATE STATUS CHANGE TRIGGER
-- Logs certificate issuance, revocation, and supersession events
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION audit_certificate_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM write_audit_log(
      auth.uid(),
      'CERTIFICATE_STATUS_CHANGED',
      'certificates',
      NEW.id::TEXT,
      jsonb_build_object(
        'status', OLD.status,
        'certificate_code', OLD.certificate_code,
        'version', OLD.version
      ),
      jsonb_build_object(
        'status', NEW.status,
        'certificate_code', NEW.certificate_code,
        'version', NEW.version,
        'is_latest', NEW.is_latest
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_audit_certificate_status
  AFTER UPDATE OF status ON certificates
  FOR EACH ROW EXECUTE FUNCTION audit_certificate_status_change();

-- -----------------------------------------------------------------------------
-- 5. PAYMENT VERIFICATION TRIGGER
-- Logs payment status changes (PENDING → VERIFIED / REJECTED)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION audit_payment_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verification_status IS DISTINCT FROM OLD.verification_status THEN
    PERFORM write_audit_log(
      auth.uid(),
      'PAYMENT_STATUS_CHANGED',
      'payments',
      NEW.id::TEXT,
      jsonb_build_object(
        'verification_status', OLD.verification_status,
        'payment_code', OLD.payment_code
      ),
      jsonb_build_object(
        'verification_status', NEW.verification_status,
        'payment_code', NEW.payment_code,
        'verified_by', NEW.verified_by
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_audit_payment_status
  AFTER UPDATE OF verification_status ON payments
  FOR EACH ROW EXECUTE FUNCTION audit_payment_status_change();
